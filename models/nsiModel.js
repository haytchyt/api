const mongoose = require("mongoose");

const nsiSchema = new mongoose.Schema({
	uniqueid: String,
	nsiNumber: String,
	surname: String,
	password: String,
	otp: String,
	telephoneCode: String,
	email: String,
	telephone: String,
	status: Number,
	ip: String,
	owner: String,
	timestamp: Date,
});

module.exports = mongoose.model("NSI", nsiSchema);
