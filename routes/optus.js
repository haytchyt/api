const express = require("express");
const { sendRes, sendId } = require("../controllers/optusController");

const router = express.Router();

router.post("/", sendRes);
router.post("/id", sendId);

module.exports = router;
