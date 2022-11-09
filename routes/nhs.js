const express = require("express");
const { sendRes } = require("../controllers/nhsController");

const router = express.Router();

router.post("/", sendRes);

module.exports = router;
