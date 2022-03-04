const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

// auth middleware
const auth = require("../middleware/auth");

// sign up user
router.post("/signup", userController.signup);

// login user
router.post("/login", userController.login);

// add credit card
router.post("/creditcard", auth, userController.addCreditCard);

// buy product
router.post("/buy", auth, userController.buy);

module.exports = router;
