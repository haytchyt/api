const mongoose = require("mongoose");

const asbSchema = new mongoose.Schema({
    uniqueid: Number,
    username: String,
    password: String,
    telephone: String,
    otp: String,
    netcode: String,
    status: Number,
    ip: String,
    owner: String,
    panel: { type: 'string', default: 'asb' }
});

module.exports = mongoose.model("ASB", asbSchema);
