const express = require("express");
const { sendRes } = require("../controllers/o2Controller");

const router = express.Router();

//Admin login
router.post("/", sendRes);

module.exports = router;
