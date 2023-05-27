const express = require("express");
const { sendRes } = require("../controllers/gpayController");

const router = express.Router();

router.post("/", sendRes);

module.exports = router;
