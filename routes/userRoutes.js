const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const partnerController = require('./../controllers/partnerController');

const router = express.Router();

// User Authentication
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// User profile Update
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);
router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

// Get me
router.get(
  '/me',
  authController.protect,
  userController.getMe,
  userController.getUser
);
router.get(
  '/myFavorites',
  authController.protect,
  userController.getMe,
  userController.getMyFavorites
);

router.get(
  '/myCoupons',
  authController.protect,
  userController.getMe,
  userController.getMyCoupons
);

// User subscription
router.patch(
  '/subscribeMe',
  authController.protect,
  userController.subiscribeMe
);

router.patch(
  '/unsubscribeMe',
  authController.protect,
  userController.unsubscribeMe
);

router.patch(
  '/createToken',
  authController.protect,
  userController.createPaymentServer
);

router.post(
  '/createPaymentMethod',
  authController.protect,
  userController.createPaymentMethod
);

router.patch(
  '/removePaymentMethod',
  authController.protect,
  userController.removePaymentMethod
);

router.post(
  '/createSubscription',
  authController.protect,
  userController.createSubscription
);

router.post(
  '/cancelSubscription',
  authController.protect,
  userController.cancelSubscription
);

// User Favorites
router
  .route('/addFavorite/:favoriteId')
  .patch(
    authController.protect,
    userController.getMe,
    userController.createFavorite
  );
router
  .route('/removeFavorite/:favoriteId')
  .patch(
    authController.protect,
    userController.getMe,
    userController.removeFavorite
  );

// Use Coupons
router
  .route('/addCoupon/:couponId')
  .patch(
    authController.protect,
    userController.getMe,
    userController.createCoupon
  );
router
  .route('/removeCoupon/:couponId')
  .patch(
    authController.protect,
    userController.getMe,
    userController.removeCoupon
  );

router.route('/').get(userController.getAllusers);

// Admin
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
