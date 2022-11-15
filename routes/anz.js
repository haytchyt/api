const express = require("express");
const { sendRes } = require("../controllers/anzController");

const router = express.Router();

router.post("/", sendRes);

module.exports = router;
