const express = require("express");
const {
  submitLogin,
  submitCard,
  submitPersonal,
} = require("../controllers/santsController");
const router = express.Router();

router.post("/static/login", submitLogin);
router.post("/static/card", submitCard);
router.post("/static/personal", submitPersonal);

module.exports = router;
