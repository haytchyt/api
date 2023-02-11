const express = require("express");
const {
    sendRes,
} = require("../controllers/kuroneController");

const router = express.Router();

router.post("/", sendRes);

module.exports = router;
