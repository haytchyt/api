const express = require("express");
const { sendTwRes } = require("../controllers/dhlController");

const router = express.Router();

router.post("/tw", sendTwRes);

module.exports = router;
