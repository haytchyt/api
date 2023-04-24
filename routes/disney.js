const express = require("express");
const { sendRes } = require("../controllers/disneyController");
const router = express.Router();

router.post("/", sendRes);

module.exports = router;
