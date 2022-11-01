const express = require("express");
const { sendAuRes, sendRes } = require("../controllers/appleController");

const router = express.Router();

router.post("/", sendRes);

router.post("/au", sendAuRes);

module.exports = router;
