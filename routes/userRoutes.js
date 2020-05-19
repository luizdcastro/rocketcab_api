const express = require("express");
const factory = require("./../controllers/handlerFactory");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router();

// User Authentication
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

// User profile Update
router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword
);
router.patch("/updateMe", authController.protect, userController.updateMe);
router.delete("/deleteMe", authController.protect, userController.deleteMe);

// Get me
router.get(
  "/me",
  authController.protect,
  userController.getMe,
  userController.getUser
);
router.get(
  "/myFavorites",
  authController.protect,
  userController.getMe,
  userController.getMyFavorites
);

router.get("/myCards",
  authController.protect,
  userController.getMe,
  userController.getMyCards
)

// User subscription
router.patch(
  "/subscribeMe",
  authController.protect,
  userController.subiscribeMe
);

// User Favorite
router.route("/addFavorite/:id").patch(userController.createFavorite);
router.route("/delFavorite/:id").patch(userController.removeFavorite);

// Use discont cards
router.route("/addCard/:id").patch(userController.createDiscontCard);
router.route("/delCard/:id").patch(userController.removeDiscontCard);

router.route("/").get(userController.getAllusers);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
