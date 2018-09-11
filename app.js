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
var templateNumber = 0;

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

// Different actions / APIs defined below.

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

app.get('/api/ledon', function(req, res) {
    var buf = Buffer.from([0x11, 0x00, 0x02, 0x02, 0x01]);

    if (encryptionEnabled) {
        buf = Buffer.concat([buf, Buffer.alloc(16 - buf.length)]);
        buf = encryption.Encrypt(buf);
    }

    callback = function(response) {
        // Analyze return code.
        if (response.readInt8(0) === 0) {
            res.json({'response': 'ok'});
        }
        else {
            res.json({
                'response': 'error',
                'errorCode': response.readInt8(3)
            });
        }
    };

    port.write(buf, function(err) {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
    });
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

app.get('/api/ledoff', function(req, res) {
    var buf = Buffer.from([0x11, 0x00, 0x02, 0x02, 0x00]);

    if (encryptionEnabled) {
        buf = Buffer.concat([buf, Buffer.alloc(16 - buf.length)]);
        buf = encryption.Encrypt(buf);
    }

    callback = function(response) {
        // Analyze return code.
        if (response.readInt8(0) === 0) {
            res.json({'response': 'ok'});
        }
        else {
            res.json({
                'response': 'error',
                'errorCode': response.readInt8(3)
            });
        }
    };

    port.write(buf, function(err) {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
    });
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

app.get('/api/send_encryption_key', function(req, res) {
    const buf = Buffer.concat([Buffer.from([0x1f, 0x02, 0x00]), Buffer.alloc(512)]);

    callback = function(response) {
        // Analyze return code.
        if (response.readInt8(0) === 0) {
            res.json({'response': 'ok'});
        }
        else {
            res.json({
                'response': 'error',
                'errorCode': response.readInt8(3)
            });
        }
    };

    port.write(buf, function(err) {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
    });

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

app.get('/api/receive_template', function(req, res) {
    template = Buffer.from([]);

    var buf = Buffer.from([0x15, 0x00, 0x00]);

    if (encryptionEnabled) {
        buf = Buffer.concat([buf, Buffer.alloc(16 - buf.length)]);
        buf = encryption.Encrypt(buf);
    }

    callback = function(response) {
        // Analyze return code.
        if (response.readInt8(0) === 0) {
            // If checksum is correct.
            if (response.readInt32BE(540) === checksum(response.slice(0, 540))) {
                template = response.slice(4, 540);
                res.json({'response': 'ok'});
            }
            else {
                template = false;
                res.json({
                    'response': 'error',
                    'errorMsg': 'Invalid checksum.'
                });
            }
        }
        else {
            res.json({
                'response': 'error',
                'errorCode': response.readInt8(3)
            });
        }
    };

    port.write(buf, function(err) {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
    });
});

app.get('/send_template', function(req, res) {
    var buf = Buffer.from([0x12, 0x02, 0x1d, templateNumber++]);

    if (templateNumber === 100) {
        templateNumber = 0;
    }

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

app.get('/api/send_template', function(req, res) {
    var buf = Buffer.from([0x12, 0x02, 0x1d, templateNumber++]);

    if (templateNumber === 100) {
        templateNumber = 0;
    }

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
            res.json({'response': 'ok'});
        }
        else {
            res.json({
                'response': 'error',
                'errorCode': response.readInt8(3)
            });
        }
    };

    port.write(buf, function(err) {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
    });
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
            console.log('Verified template number: ', response.readInt8(3));
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

app.get('/api/verification_1toN', function(req, res) {
    var buf = Buffer.from([0x13, 0x00, 0x02, 0x08]);

    if (encryptionEnabled) {
        buf = Buffer.concat([buf, Buffer.alloc(16 - buf.length)]);
        buf = encryption.Encrypt(buf);
    }

    callback = function(response) {
        // Analyze return code.
        if (response.readInt8(0) === 0) {
            res.json({
                'response': 'ok',
                'verifiedTemplateNumber': response.readInt8(3)
            });
        }
        else {
            res.json({
                'response': 'error',
                'errorCode': response.readInt8(3)
            });
        }
    };

    port.write(buf, function(err) {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
    });
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

app.get('/api/reset', function(req, res) {
    var buf = Buffer.from([0x17, 0x00, 0x00]);

    if (encryptionEnabled) {
        buf = Buffer.concat([buf, Buffer.alloc(16 - buf.length)]);
        buf = encryption.Encrypt(buf);
    }

    callback = function(response) {
        // Analyze return code.
        if (response.readInt8(0) === 0) {
            res.json({'response': 'ok'});
        }
        else {
            res.json({
                'response': 'error',
                'errorCode': response.readInt8(3)
            });
        }
    };

    port.write(buf, function(err) {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
    });

    encryptionEnabled = false;
});

process.on('SIGINT', function() {
    port.close();
    process.exit();
})

var listener = app.listen(80, function() {
    console.log('Listening on port ' + listener.address().port);
});
