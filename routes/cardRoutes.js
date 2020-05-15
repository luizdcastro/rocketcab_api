const express = require("express");
const cardController = require("./../controllers/cardController");

const router = express.Router();

router
  .route("/")
  .post(cardController.createCard)
  .get(cardController.getAllCards);

router
  .route("/:id")
  .get(cardController.getCard)
  .delete(cardController.deleteCard);

module.exports = router;
