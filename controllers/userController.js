const User = require("./../models/userModel");
const factoty = require("./../controllers/handlerFactory");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");

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
    return next(new AppError("This route is not for password update!", 400));
  }

  const filterBody = filterObj(req.body, "name", "email");
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
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
    status: "success",
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
    status: "success",
    data: {
      status: 'subscription inactive',
    },
  });
});



exports.createFavorite = catchAsync(async (req, res, next) => {
  if (!req.body.favorite) req.body.favorite = req.params.favoriteId
  const favorite = await User.findByIdAndUpdate(req.user.id, {
    $addToSet: { favorite: req.body.favorite },
    new: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: favorite,
    },
  });
});

exports.removeFavorite = catchAsync(async (req, res, next) => {
  if (!req.body.favorite) req.body.favorite = req.params.favoriteId
  const favorite = await User.findByIdAndUpdate(req.user.id, {
    $pull: { favorite: { $in: req.body.favorite } },
    new: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: favorite,
    },
  });
});

exports.createCoupon = catchAsync(async (req, res, next) => {
  if (!req.body.coupon) req.body.coupon = req.params.couponId
  const coupon = await User.findByIdAndUpdate(req.params.id, {
    $addToSet: { coupon: req.body.coupon },
    new: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: coupon,
    },
  });
});

exports.removeCoupon = catchAsync(async (req, res, next) => {
  if (!req.body.coupon) req.body.coupon = req.params.couponId
  const coupon = await User.findByIdAndUpdate(req.params.id, {
    $pull: { coupon: { $in: req.body.coupon } },
    new: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: coupon,
    },
  });
});

exports.getMyFavorites = catchAsync(async (req, res, next) => {
  const myFavorites = await User.findById(req.user.id, {
    favorite: req.user.favorite,
  }).populate({ path: "favorite", select: "name" });

  res.status(200).json({
    status: "success",
    data: {
      myFavorites,
    },
  });
});

exports.getMyCoupons = catchAsync(async (req, res, next) => {
  const myCoupons = await User.findById(req.user.id, {
    coupon: req.user.coupon,
  }).populate({ path: "coupon", select: "name" })

  res.status(200).json({
    status: "success",
    data: {
      myCoupons
    }
  })
});