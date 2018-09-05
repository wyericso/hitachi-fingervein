var express = require('express');
var app = express();

var SerialPort = require('serialport');
var port = new SerialPort('/dev/ttyACM0', function (err) {
    if (err) {
        return console.log('Error: ', err.message);
    }
});

const encryption = require('./build/Release/encryption');
var m_uKttWork;
var encryptionEnabled = false;

port.on('data', function(data) {
    console.log('Encryption enabled: ', encryptionEnabled);
    if (encryptionEnabled) {
        data = encryption.DecryptBlock(m_uKttWork, data);
    }
    console.log('Data: ', data);
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/led', function(req, res) {
    port.write(Buffer.from([0x11, 0x00, 0x02, 0x02, 0x01]), function(err) {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
    });
    setTimeout(() => {
        port.write(Buffer.from([0x11, 0x00, 0x02, 0x02, 0x00]), function(err) {
            if (err) {
                return console.log('Error on write: ', err.message);
            }
        });
    }, 3000);
    res.redirect('/');
});

app.get('/send_encryption_key', function(req, res) {
    const buf = Buffer.concat([Buffer.from([0x1f, 0x02, 0x00]), Buffer.alloc(512)]);
    console.log(buf);

    port.write(buf, function(err) {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
    });
    res.redirect('/');

    m_uKttWork = encryption.SendEncryptionKey();
    encryptionEnabled = true;
});

app.get('/reset', function(req, res) {
    res.redirect('/');
});

var listener = app.listen(80, function() {
    console.log('Listening on port ' + listener.address().port);
});
