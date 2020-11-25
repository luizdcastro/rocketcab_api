const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');
const crypto = require('crypto');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    secure: true,
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, isPartner } = req.body;

  if (!name || !email) {
    next(new AppError('Por favor, informe seu nome e email.', 400));
  }

  if (password !== passwordConfirm) {
    return next(new AppError('A confirmação da senha está incorreta.', 400));
  }

  if (password.length < 6) {
    return next(new AppError('A senha deve ter no mínimo 6 digitos.', 400));
  }

  const userEmail = await User.findOne({ email: req.body.email });
  if (userEmail) {
    return next(new AppError(`O email ${email} já está cadastrado.`));
  }

  const user = await User.create({
    cpf: req.body.cpf,
    name: req.body.name,
    birthdayDate: req.body.date,
    email: req.body.email,
    phone: req.body.phone,
    isPartner: req.body.isPartner,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  await User.findById(user._id);

  createSendToken(user, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { cpf, password } = req.body;
  if (!cpf || !password) {
    next(new AppError('Por favor, entre com seu cpf e senha', 400));
  }

  const user = await User.findOne({ cpf }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    next(new AppError('Senha ou cpf incorreto', 401));
  }

  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belong to the token does no longer exists!', 401)
    );
  }

  if (currentUser.changedPasswordAfter(decoded.id)) {
    return next(
      new AppError('User recently changed password! Please log in again', 401)
    );
  }
  req.user = currentUser;
  next();
});

exports.restrictToSubscriber = (...subscription) => {
  return (req, res, next) => {
    if (!subscription.includes(req.user.subscription)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ cpf: req.body.cpf });
  if (!user) {
    return next(new AppError('There is no user with this cpf'));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `https://rocketcab.herokuapp.com/reset-password/${resetToken}`;

  const message = `Forgot your password? Submit your a PATCH request with your new password and passwordConfirm to ${resetURL}.\nIf you did not forget your password, please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token',
      message,
    });

    res.status(200).json({
      status: 'success',
      message,
    });
  } catch (err) {
    console.log(err)
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.createPasswordResetToken = undefined;
  await user.save();

  createSendToken(user, 200, res);
});

exports.updatePassword = async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('A senha atual está incorreta.', 400));
  }

  if (req.body.password !== req.body.passwordConfirm) {
    return next(new AppError('A confirmação da senha está incorreta.', 400));
  }

  if (!req.body.password || !req.body.passwordConfirm) {
    return next(new AppError('Faltando preencher senha ou confirmação.', 400));
  }

  if (req.body.password.length < 6) {
    return next(new AppError('A senha deve ter no mínimo 6 digitos.', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  createSendToken(user, 200, res);
};
