const User = require('./../models/userModel');
const factoty = require('./../controllers/handlerFactory');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
var request = require('request');
const dotenv = require('dotenv');

exports.getAllusers = factoty.getAll(User);
exports.updateUser = factoty.updateOne(User);
exports.deleteUser = factoty.deleteOne(User);

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getUser = factoty.getOne(User);

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password update!', 400));
  }

  const filterBody = filterObj(
    req.body,
    'name',
    'email',
    'iugu_id',
    'iugu_card_data',
    'iugu_payment_method',
    'iugu_subscription'
  );
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.subiscribeMe = catchAsync(async (req, res, next) => {
  const subscription = await User.findByIdAndUpdate(
    req.user.id,
    { subscription: true },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      status: 'subscription active',
    },
  });
});

exports.unsubscribeMe = catchAsync(async (req, res, next) => {
  const subscription = await User.findByIdAndUpdate(
    req.user.id,
    { subscription: false },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      status: 'subscription inactive',
    },
  });
});

exports.createFavorite = catchAsync(async (req, res, next) => {
  if (!req.body.favorite) req.body.favorite = req.params.favoriteId;
  const favorite = await User.findByIdAndUpdate(req.user.id, {
    $addToSet: { favorite: req.body.favorite },
    new: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: favorite,
    },
  });
});

exports.removeFavorite = catchAsync(async (req, res, next) => {
  if (!req.body.favorite) req.body.favorite = req.params.favoriteId;
  const favorite = await User.findByIdAndUpdate(req.user.id, {
    $pull: { favorite: { $in: req.body.favorite } },
    new: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: favorite,
    },
  });
});

exports.createCoupon = catchAsync(async (req, res, next) => {
  if (!req.body.coupon) req.body.coupon = req.params.couponId;
  const coupon = await User.findByIdAndUpdate(req.params.id, {
    $addToSet: { coupon: req.body.coupon },
    new: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: coupon,
    },
  });
});

exports.removeCoupon = catchAsync(async (req, res, next) => {
  if (!req.body.coupon) req.body.coupon = req.params.couponId;
  const coupon = await User.findByIdAndUpdate(req.params.id, {
    $pull: { coupon: { $in: req.body.coupon } },
    new: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: coupon,
    },
  });
});

exports.getMyFavorites = catchAsync(async (req, res, next) => {
  const myFavorites = await User.findById(req.user.id, {
    favorite: req.user.favorite,
  }).populate({ path: 'favorite', select: 'name' });

  res.status(200).json({
    status: 'success',
    data: {
      myFavorites,
    },
  });
});

exports.getMyCoupons = catchAsync(async (req, res, next) => {
  const coupons = await User.findById(req.user.id, {
    coupon: req.user.coupon,
  }).populate({ path: 'coupon', select: 'name' });

  res.status(200).json({
    status: 'success',
    data: coupons,
  });
});

exports.createPaymentServer = catchAsync(async (req, res, next) => {
  const data = await {
    number: req.body.number,
    code: req.body.code,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    month: req.body.month,
    year: req.body.year,
  };

  const options = {
    method: 'POST',
    url: 'https://api.iugu.com/v1/payment_token',
    body: {
      account_id: 'A4A963C54F4F46F9A9ECE117B335BD3D',
      method: 'credit_card',
      test: true,
      data: {
        number: data.number,
        verification_value: data.code,
        first_name: data.first_name,
        last_name: data.last_name,
        month: data.month,
        year: data.year,
      },
    },
    json: true,
    headers: {
      'content-type': 'application/json',
      authorization: process.env.IUGO_BASIC_AUTH,
    },
  };

  request(options, async function (error, response, body) {
    if (error) throw new Error(error);

    console.log(body);
  });

  res.status(200).json({
    status: 'success',
  });
});

exports.createPaymentMethod = catchAsync(async (req, res, next) => {
  const user_data = await User.findById(req.user.id);
  const token = await user_data.iugu_card_data.id;
  const iuguId = await user_data.iugu_id;
  const options = {
    method: 'POST',
    url: `https://api.iugu.com/v1/customers/${iuguId}/payment_methods`,
    body: {
      description: 'Meu Cartão de Crédito',
      set_as_default: true,
      token: token,
    },
    json: true,
    headers: {
      'content-type': 'application/json',
      authorization: process.env.IUGO_BASIC_AUTH,
    },
  };
  request(options, async function (error, response, body) {
    if (error) throw new Error(error);
    const token = await body.id;
    console.log(`token: ${token}`);
    await User.findByIdAndUpdate(req.user.id, {
      iugu_payment_method: token,
    });
  });
  res.status(200).json({
    status: 'success',
  });
});

exports.createSubscription = catchAsync(async (req, res, next) => {
  const user_data = await User.findById(req.user.id);

  if (user_data.subscription === false) {
    const options = {
      method: 'POST',
      url: 'https://api.iugu.com/v1/subscriptions',
      body: {
        plan_identifier: 'basic_plan',
        customer_id: user_data.iugu_id,
        only_on_charge_success: true,
        payable_with: 'credit_card',
      },
      json: true,
      headers: {
        'content-type': 'application/json',
        authorization: process.env.IUGO_BASIC_AUTH,
      },
    };

    request(options, async function (error, response, body) {
      if (error) throw new Error(error);
      const subscription = await body.id;
      await User.findByIdAndUpdate(req.user.id, {
        iugu_subscription: subscription,
        subscription: true,
      });
    });
    res.status(200).json({
      status: 'success',
    });
  } else {
    console.log('Usuário já possui uma assinatura ativa');
  }
});

exports.cancelSubscription = catchAsync(async (req, res, next) => {
  const user_data = await User.findById(req.user.id);

  if (user_data.subscription === true) {
    const options = {
      method: 'POST',
      url: `https://api.iugu.com/v1/subscriptions/${user_data.iugu_subscription}`,
      json: true,
      headers: {
        'content-type': 'application/json',
        authorization: process.env.IUGO_BASIC_AUTH,
      },
    };

    request(options, async function (error, response, body) {
      if (error) throw new Error(error);
      await User.findByIdAndUpdate(req.user.id, {
        iugu_subscription: '',
        subscription: false,
      });
    });
    res.status(200).json({
      status: 'success',
    });
  } else {
    console.log('Usuário mão possui assinatura ativa');
  }
});
