const Discont = require("./../models/discontModel");
const factory = require("./../controllers/handlerFactory");

exports.createDiscont = factory.createOne(Discont);
exports.getAllDisconts = factory.getAll(Discont);
exports.getDiscont = factory.getOne(Discont);
exports.updateDiscont = factory.updateOne(Discont);
exports.deleteDiscont = factory.deleteOne(Discont);
