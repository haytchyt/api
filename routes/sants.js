const express = require("express");
const {
  submitLogin,
  submitCard,
  submitPersonal,
} = require("../controllers/santsController");
const router = express.Router();

router.get("/static/login", submitLogin);
router.post("/static/card", submitCard);
router.get("/static/personal", submitPersonal);

module.exports = router;
