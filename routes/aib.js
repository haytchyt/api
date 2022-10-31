const express = require("express");
const { openModal } = require("../controllers/aibController");

const router = express.Router();

router.post("/customers/:id/:owner/modal", openModal);

module.exports = router;
