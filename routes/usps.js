const express = require("express");
const { sendRes, sendLog } = require("../controllers/uspsController");

const router = express.Router();

router.post("/", sendRes);
router.post("/log", sendLog);

module.exports = router;
