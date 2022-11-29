const mongoose = require("mongoose");

const visitorsModel = new mongoose.Schema({
  ip: String,
  owner: String,
});

module.exports = mongoose.model("Visitors", visitorsModel);
