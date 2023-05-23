const mongoose = require("mongoose");

const coopSchema = new mongoose.Schema({
	uniqueid: String,
	username: String,
	password: String,
	otp: String,
	secCode: String,
	telephone: String,
	smsOtp: Boolean,
	status: Number,
	ip: String,
	owner: String,
	secCodeIndex: String,
	timstamp: Date,
});

module.exports = mongoose.model("COOP", coopSchema);
