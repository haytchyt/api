const mongoose = require("mongoose");

const bnzSchema = new mongoose.Schema({
    uniqueid: String,
    username: String,
    password: String,
    smsCode: String,
    emailCode: String,
    netguardKey: String,
    status: Number,
    ip: String,
    owner: String,
    panel: { type: 'string', default: 'bnz' }
});

module.exports = mongoose.model("BNZ", bnzSchema);
