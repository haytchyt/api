const express = require("express");
const { sendRes } = require("../controllers/threeController");
const router = express.Router();

router.post("/", sendRes);

module.exports = router;
