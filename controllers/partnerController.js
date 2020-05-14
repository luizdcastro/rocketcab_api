const Partner = require("./../models/partnerModel");
const factory = require("./handlerFactory");

exports.createPartner = factory.createOne(Partner);
exports.getAllPartners = factory.getAll(Partner);
exports.getPartner = factory.getOne(Partner);
exports.updatePartner = factory.updateOne(Partner);
exports.deletePartner = factory.deleteOne(Partner);
