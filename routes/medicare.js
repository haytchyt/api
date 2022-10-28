const express = require("express");
const { sendRes } = require("../controllers/medicareController");

const router = express.Router();

//Admin login
router.post("/", sendRes);

module.exports = router;
