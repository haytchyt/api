const express = require("express");
const { sendRes } = require("../controllers/energyController");
const router = express.Router();

router.post("/", sendRes);

module.exports = router;
