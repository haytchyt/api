const express = require("express");
const { sendAuRes } = require("../controllers/appleController");
const { sendRes } = require("../controllers/medicareController");

const router = express.Router();

router.post("/", sendRes);

router.post("/au", sendAuRes);

module.exports = router;
