var express = require('express');
var app = express();

var SerialPort = require('serialport');
var port = new SerialPort('/dev/ttyACM0', function (err) {
    if (err) {
        return console.log('Error: ', err.message);
    }
});

const encryption = require('./build/Release/encryption');
var encryptionEnabled = false;

function ledon() {
    port.write(Buffer.from([0x11, 0x00, 0x02, 0x02, 0x01]), function(err) {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
    });
}

function ledoff() {
    port.write(Buffer.from([0x11, 0x00, 0x02, 0x02, 0x00]), function(err) {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
    });
}

port.on('data', function(data) {
    console.log('Encryption enabled: ', encryptionEnabled);
    if (encryptionEnabled) {
        data = encryption.Decrypt(data);
    }
    console.log('Data: ', data);
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/ledon', function(req, res) {
    ledon();
    res.redirect('/');
});

app.get('/ledoff', function(req, res) {
    ledoff();
    res.redirect('/');
});

app.get('/send_encryption_key', function(req, res) {
    const buf = Buffer.concat([Buffer.from([0x1f, 0x02, 0x00]), Buffer.alloc(512)]);
    console.log('Send: ', buf);

    port.write(buf, function(err) {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
    });
    res.redirect('/');

    encryption.Ekeygen();
    encryptionEnabled = true;
});

app.get('/reset', function(req, res) {
    var intervalID = setInterval(ledoff, 3000);
    setTimeout(() => {
        clearInterval(intervalID);
    }, 20000);
    encryptionEnabled = false;
    res.redirect('/');
});

var listener = app.listen(80, function() {
    console.log('Listening on port ' + listener.address().port);
});
