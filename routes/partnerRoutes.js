const express = require("express");
const partnerController = require("./../controllers/partnerController");

const router = express.Router();

router.route("/:id/:productId").patch(partnerController.deleteProduct);
router.route("/:id/").patch(partnerController.createProduct);

router
  .route("/")
  .post(partnerController.createPartner)
  .get(partnerController.getAllPartners);

router
  .route("/:id")
  .get(partnerController.getPartner)
  .patch(partnerController.updatePartner)
  .delete(partnerController.deletePartner);

module.exports = router;
