const User = require("./../models/userModel");
const factoty = require("./../controllers/handlerFactory");

exports.createUser = factoty.createOne(User);
exports.getAllusers = factoty.getAll(User);
exports.getUser = factoty.getOne(User);
exports.updateUser = factoty.updateOne(User);
exports.deleteUser = factoty.deleteOne(User);
