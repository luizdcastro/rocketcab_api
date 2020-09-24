const Partner = require('./../models/partnerModel');
const User = require('./../models/userModel');
const Discont = require('./../models/discontModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');

exports.createPartner = factory.createOne(Partner);
exports.getAllPartners = factory.getAll(Partner);
exports.getPartner = factory.getOne(Partner, {
  path: 'discont',
  select: 'name percentage days time description',
});
exports.updatePartner = factory.updateOne(Partner);

exports.deletePartner = catchAsync(async (req, res, next) => {
  await Partner.findByIdAndDelete(req.params.id);
  await Discont.deleteMany({
    partner: req.params.id,
  });
  await User.updateMany({
    $pull: { favorite: req.params.id },
    multi: true,
  });

  res.status(201).json({
    status: 'success',
    data: null,
  });
});
