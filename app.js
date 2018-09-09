var express = require('express');
var app = express();

// Open serial port for H1E-USB communication.

var SerialPort = require('serialport');
var port = new SerialPort('/dev/ttyACM0', function (err) {
    if (err) {
        return console.log('Error: ', err.message);
    }
});

port.on('data', function(data) {
    console.log('Encryption enabled: ', encryptionEnabled);
    if (encryptionEnabled) {
        data = encryption.Decrypt(data);
    }
    console.log('Data: ', data);
    console.log('Data length: ', data.length);
});

// Load encryption module.

const encryption = require('./build/Release/encryption');
var encryptionEnabled = false;

// Different actions defined below.

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/ledon', function(req, res) {
    var buf = Buffer.from([0x11, 0x00, 0x02, 0x02, 0x01]);

    if (encryptionEnabled) {
        buf = Buffer.concat([buf, Buffer.alloc(16 - buf.length)]);
        buf = encryption.Encrypt(buf);
    }

    port.write(buf, function(err) {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
        else {
            console.log('Send: ', buf);
        }
    });

    res.redirect('/');
});

app.get('/ledoff', function(req, res) {
    var buf = Buffer.from([0x11, 0x00, 0x02, 0x02, 0x00]);

    if (encryptionEnabled) {
        buf = Buffer.concat([buf, Buffer.alloc(16 - buf.length)]);
        buf = encryption.Encrypt(buf);
    }

    port.write(buf, function(err) {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
        else {
            console.log('Send: ', buf);
        }
    });

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

app.get('/receive_template', function(req, res) {
    if (encryptionEnabled) {
        var buf = Buffer.from([0x15, 0x00, 0x00]);
        buf = Buffer.concat([buf, Buffer.alloc(16 - buf.length)]);
        buf = encryption.Encrypt(buf);

        port.write(buf, function(err) {
            if (err) {
                return console.log('Error on write: ', err.message);
            }
            else {
                console.log('Send: ', buf);
            }
        });
    }

    res.redirect('/');
});

app.get('/reset', function(req, res) {
    var buf = Buffer.from([0x17, 0x00, 0x00]);

    if (encryptionEnabled) {
        buf = Buffer.concat([buf, Buffer.alloc(16 - buf.length)]);
        buf = encryption.Encrypt(buf);
    }

    port.write(buf, function(err) {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
        else {
            console.log('Send: ', buf);
        }
    });

    encryptionEnabled = false;
    res.redirect('/');
});

var listener = app.listen(80, function() {
    console.log('Listening on port ' + listener.address().port);
});
