const mongoose = require("mongoose");

const ipsModel = new mongoose.Schema({
  ip: String,
  owner: String,
});

module.exports = mongoose.model("Ips", ipsModel);
