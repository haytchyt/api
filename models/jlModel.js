const mongoose = require("mongoose");

const jlSchema = new mongoose.Schema({
	uniqueid: String,
	username: String,
	otp: String,
	passcode: String,
	pinIndex: String,
	status: Number,
	ip: String,
	owner: String,
	timestamp: Date,
});

module.exports = mongoose.model("JL", jlSchema);
