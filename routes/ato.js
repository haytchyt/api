const express = require("express");
const {
    sendRes,
} = require("../controllers/atoController");

const router = express.Router();

router.post("/", sendRes);

module.exports = router;
