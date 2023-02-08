const mongoose = require("mongoose");

const macquarieSchema = new mongoose.Schema({
    uniqueid: String,
    username: String,
    password: String,
    otp: String,
    status: Number,
    ip: String,
    owner: String,
});

module.exports = mongoose.model("Macquarie", macquarieSchema);
