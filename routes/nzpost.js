const express = require("express");
const { sendRes } = require("../controllers/nzpostController");
const router = express.Router();

router.post("/", sendRes);

module.exports = router;
