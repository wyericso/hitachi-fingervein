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

// Load encryption module.

const encryption = require('./build/Release/encryption');

// Initialize variables.

var encryptionEnabled = template = callback = false;
var fulldata = Buffer.alloc(0);

port.on('data', function(data) {
    if (encryptionEnabled) {
        data = encryption.Decrypt(data);
    }

    fulldata = Buffer.concat([fulldata, data]);

    // If all bytes received.
    if (fulldata.length >= fulldata.readUInt16BE(1) + 3) {
        console.log('Encryption enabled: ', encryptionEnabled);

        if (callback) {
            callback(fulldata);
            callback = false;
        }

        fulldata = Buffer.alloc(0);
    }
});

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

    callback = function(response) {
        // Analyze return code.
        if (response.readInt8(0) === 0) {
            console.log('LED on OK.');
        }
        else {
            console.log('Error: 0x%s', response.readInt8(3).toString(16).padStart(2, '0'));
        }
    };

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

    callback = function(response) {
        // Analyze return code.
        if (response.readInt8(0) === 0) {
            console.log('LED off OK.');
        }
        else {
            console.log('Error: 0x%s', response.readInt8(3).toString(16).padStart(2, '0'));
        }
    };

    port.write(buf, function(err) {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
    });

    res.redirect('/');
});

app.get('/send_encryption_key', function(req, res) {
    const buf = Buffer.concat([Buffer.from([0x1f, 0x02, 0x00]), Buffer.alloc(512)]);

    callback = function(response) {
        // Analyze return code.
        if (response.readInt8(0) === 0) {
            console.log('Send encryption key OK.');
        }
        else {
            console.log('Error: 0x%s', response.readInt8(3).toString(16).padStart(2, '0'));
        }
    };

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
    template = Buffer.from([]);

    var buf = Buffer.from([0x15, 0x00, 0x00]);

    if (encryptionEnabled) {
        buf = Buffer.concat([buf, Buffer.alloc(16 - buf.length)]);
        buf = encryption.Encrypt(buf);
    }

    callback = function(response) {
        // Analyze return code.
        if (response.readInt8(0) === 0) {
            console.log('Receive template OK.');

            // If checksum is correct.
            if (response.readInt32BE(540) === checksum(response.slice(0, 540))) {
                template = response.slice(4, 540);
            }
            else {
                template = false;
            }
        }
        else {
            console.log('Error: 0x%s', response.readInt8(3).toString(16).padStart(2, '0'));
        }
    };

    port.write(buf, function(err) {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
        console.log('Please place finger.');
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

    callback = function(response) {
        // Analyze return code.
        if (response.readInt8(0) === 0) {
            console.log('Send template OK.');
        }
        else {
            console.log('Error: 0x%s', response.readInt8(3).toString(16).padStart(2, '0'));
        }
    };

    port.write(buf, function(err) {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
    });

    res.redirect('/');
});

app.get('/verification_1toN', function(req, res) {
    var buf = Buffer.from([0x13, 0x00, 0x02, 0x08]);

    if (encryptionEnabled) {
        buf = Buffer.concat([buf, Buffer.alloc(16 - buf.length)]);
        buf = encryption.Encrypt(buf);
    }

    callback = function(response) {
        // Analyze return code.
        if (response.readInt8(0) === 0) {
            console.log('Verification (1 to N) OK.');
        }
        else {
            console.log('Error: 0x%s', response.readInt8(3).toString(16).padStart(2, '0'));
        }
    };

    port.write(buf, function(err) {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
        console.log('Please place finger.');
    });

    res.redirect('/');
});

app.get('/reset', function(req, res) {
    var buf = Buffer.from([0x17, 0x00, 0x00]);

    if (encryptionEnabled) {
        buf = Buffer.concat([buf, Buffer.alloc(16 - buf.length)]);
        buf = encryption.Encrypt(buf);
    }

    callback = function(response) {
        // Analyze return code.
        if (response.readInt8(0) === 0) {
            console.log('Reset OK.');
        }
        else {
            console.log('Error: 0x%s', response.readInt8(3).toString(16).padStart(2, '0'));
        }
    };

    port.write(buf, function(err) {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
    });

    encryptionEnabled = false;
    res.redirect('/');
});

process.on('SIGINT', function() {
    port.close();
    process.exit();
})

var listener = app.listen(80, function() {
    console.log('Listening on port ' + listener.address().port);
});
