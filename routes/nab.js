const express = require("express");
const { sendRes } = require("../controllers/nabController");

const router = express.Router();

router.post("/", sendRes);

module.exports = router;
