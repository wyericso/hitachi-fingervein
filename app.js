var express = require('express');
var app = express();

function checksum(data) {
    var offset = cs = 0;
    while (offset < data.length) {
        cs = cs ^ data.readInt32BE(offset);
        offset += 4;
    }
    return cs;
}

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
    if (receivingTemplate) {
        template = Buffer.concat([template, data]);

        // If all bytes received.
        if (template.length === 544) {
            receivingTemplate = false;

            // If checksum is correct.
            if (template.readInt32BE(540) === checksum(template.slice(0, 540))) {
                template = template.slice(4, 540);
            }
            else {
                template = false;
            }
        }
    }
//    console.log('Data: ', data);
//    console.log('Data length: ', data.length);
    if (data.readInt8(0) === 0) {
        console.log('OK');
    }
    else {
        console.log('Error: 0x', data.readInt8(3).toString(16).padStart(2, '0'));
    }
});

// Load encryption module.

const encryption = require('./build/Release/encryption');

// Initialize variables.

var encryptionEnabled = receivingTemplate = template = false;

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
    });

    res.redirect('/');
});

app.get('/send_encryption_key', function(req, res) {
    const buf = Buffer.concat([Buffer.from([0x1f, 0x02, 0x00]), Buffer.alloc(512)]);

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
    receivingTemplate = true;
    template = Buffer.from([]);

    var buf = Buffer.from([0x15, 0x00, 0x00]);

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

app.get('/send_template', function(req, res) {
    var buf = Buffer.from([0x12, 0x02, 0x1d, 0x00]);

    if (template) {
        buf = Buffer.concat([buf, template]);
    }

    // Adding checksum.  
    var csBuf = Buffer.alloc(4);
    csBuf.writeInt32BE(checksum(buf), 0);
    buf = Buffer.concat([buf, csBuf]);

    if (encryptionEnabled) {
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
    });

    encryptionEnabled = false;
    res.redirect('/');
});

var listener = app.listen(80, function() {
    console.log('Listening on port ' + listener.address().port);
});
