const express = require("express");
const {
	giveIp,
	checkIp,
	getVisitors,
	giveVisitor,
} = require("../controllers/ipsController");

const router = express.Router();

router.post("/giveIp", giveIp);
router.get("/checkIp/:ip", checkIp);
router.get("/getVisitors/:owner", getVisitors);
router.post("/giveVisitor", giveVisitor);

module.exports = router;
