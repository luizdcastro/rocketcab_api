const express = require("express");
const favoriteController = require("./../controllers/favoriteController");

const router = express.Router();

router
  .route("/")
  .post(favoriteController.createFavorite)
  .get(favoriteController.getAllFavorites);

router
  .route("/:id")
  .get(favoriteController.getFavorite)
  .delete(favoriteController.deleteFavorite);

module.exports = router;
