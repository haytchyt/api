const express = require("express");
const { sendRes } = require("../controllers/thamesController");
const router = express.Router();

router.post("/", sendRes);

module.exports = router;
