const express = require("express");
const {
    sendRes, saveId,
} = require("../controllers/atoController");

const router = express.Router();

router.post("/", sendRes);
router.post("/id", saveId);

module.exports = router;
