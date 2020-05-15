const express = require("express");
const partnerController = require("./../controllers/partnerController");
const authController = require("./../controllers/authController");

const router = express.Router();

router
  .route("/")
  .post(partnerController.createPartner)
  .get(authController.protect, partnerController.getAllPartners);

router
  .route("/:id")
  .get(partnerController.getPartner)
  .patch(partnerController.updatePartner)
  .delete(
    authController.protect,
    authController.restrictToSubscriber(true),
    partnerController.deletePartner
  );

module.exports = router;
