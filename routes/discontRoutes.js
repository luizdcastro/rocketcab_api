const express = require("express");
const discontController = require("./../controllers/discontController");

const router = express.Router();

router
  .route("/")
  .post(discontController.createDiscont)
  .get(discontController.getAllDisconts);

router
  .route("/:id")
  .get(discontController.getDiscont)
  .patch(discontController.updateDiscont)
  .delete(discontController.deleteDiscont);

module.exports = router;
