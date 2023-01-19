const express = require("express");
const {
    getOwnerVics,
} = require("../controllers/multiNzController");

const router = express.Router();

router.get("/customers/:owner", getOwnerVics);

module.exports = router;
