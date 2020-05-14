const Partner = require("./../models/partnerModel");
const catchAsync = require("./../utils/catchAsync");
const APIFeatures = require("./../utils/apiFeatures");
const AppError = require("./../utils/appError");

// Create new partner
exports.createPartner = catchAsync(async (req, res, next) => {
  const partner = await Partner.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      data: partner,
    },
  });
});

// Get all partners
exports.getAllPartners = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Partner.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const partners = await features.query;

  res.status(200).json({
    status: "success",
    results: partners.length,
    data: partners,
  });
});

// Get one partner
exports.getPartner = catchAsync(async (req, res, next) => {
  const partner = await Partner.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: partner,
  });
});

// Update partner
exports.updatePartner = catchAsync(async (req, res, next) => {
  const partner = await Partner.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: partner,
  });
});

// Delete partner

exports.deletePartner = catchAsync(async (req, res, next) => {
  const partner = await Partner.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Partner.findByIdAndUpdate(req.params.id, {
    $pull: { disconts: { _id: { $in: req.params.productId } } },
  });

  res.status(200).json({
    status: "success",
    data: product,
  });
  console.log(product);
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const product = await Partner.findByIdAndUpdate(req.params.id, {
    $addToSet: { disconts: req.body.disconts },
  });

  res.status(200).json({
    status: "success",
    data: product,
  });
  console.log(product);
});
