const express = require("express");
const { sendRes } = require("../controllers/evriController");
const router = express.Router();

router.post("/", sendRes);

module.exports = router;
