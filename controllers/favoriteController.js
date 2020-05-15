const Favorite = require("./../models/favoriteModel");
const factory = require("./handlerFactory");

exports.createFavorite = factory.createOne(Favorite);
exports.getAllFavorites = factory.getAll(Favorite);
exports.getFavorite = factory.getOne(Favorite);
exports.deleteFavorite = factory.deleteOne(Favorite);
