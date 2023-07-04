const mongoose = require("mongoose");

const panelSchema = new mongoose.Schema(
	{
		uniqueid: String,
		status: Number,
		ip: String,
		owner: String,
		timestamp: Date,
		panelName: String,
	},
	{ strict: false }
);

module.exports = mongoose.model("Panel", panelSchema);
