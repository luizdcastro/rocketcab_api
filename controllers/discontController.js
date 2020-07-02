const Discont = require("./../models/discontModel");
const User = require("./../models/userModel");
const factory = require("./../controllers/handlerFactory");
const catchAsync = require("./../utils/catchAsync");

exports.createDiscont = factory.createOne(Discont);
exports.getAllDisconts = factory.getAll(Discont);
exports.getDiscont = factory.getOne(Discont);
exports.updateDiscont = factory.updateOne(Discont);

exports.deleteDiscont = catchAsync(async (req, res, next) => {
  await Discont.findByIdAndDelete(req.params.id);
  await User.updateMany({
    $pull: { coupon: req.params.id },
    multi: true,
  });

  res.status(201).json({
    status: "success",
    data: null,
  });
});