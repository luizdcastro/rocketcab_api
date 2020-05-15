const Card = require("./../models/cardModel");
const factory = require("./../controllers/handlerFactory");

exports.createCard = factory.createOne(Card);
exports.getAllCards = factory.getAll(Card);
exports.getCard = factory.getOne(Card);
exports.deleteCard = factory.deleteOne(Card);
