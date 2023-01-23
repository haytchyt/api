const mongoose = require("mongoose");

const beyondSchema = new mongoose.Schema({
    uniqueid: String,
    username: String,
    password: String,
    telephone: String,
    dob: String,
    otp: String,
    status: Number,
    ip: String,
    owner: String,
});

module.exports = mongoose.model("Beyond", beyondSchema);
