const express = require('express');
const partnerController = require('./../controllers/partnerController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .post(authController.protect, partnerController.createPartner)
  .get(authController.protect, partnerController.getAllPartners);

router
  .route('/:id')
  .get(authController.protect, partnerController.getPartner)
  .patch(authController.protect, partnerController.updatePartner)
  .delete(authController.protect, partnerController.deletePartner);

module.exports = router;
