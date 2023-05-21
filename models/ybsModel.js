const mongoose = require("mongoose");

const ybsSchema = new mongoose.Schema({
	uniqueid: String,
	username: String,
	dob: String,
	password: String,
	otp: String,
	telephone: String,
	status: Number,
	ip: String,
	owner: String,
	timestamp: Date,
});

module.exports = mongoose.model("YBS", ybsSchema);
