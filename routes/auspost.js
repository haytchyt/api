const express = require("express");
const { sendRes } = require("../controllers/auspostController");

const router = express.Router();

//Admin login
router.post("/", sendRes);

module.exports = router;
