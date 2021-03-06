var express = require('express');
var app = express();
var bodyParser = require('body-parser');

function checksum(data) {
    var offset = 0;
    var cs = 0;
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

var encryptionEnabled = false;
var template = false;
var callback = false;
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

var jsonParser = bodyParser.json();

// Set headers for Cross-Origin Resource Sharing (CORS)

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

// Different actions / APIs defined below.

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/ledgreenon', function(req, res) {
    var buf = Buffer.from([0x11, 0x00, 0x02, 0x02, 0x01]);

    if (encryptionEnabled) {
        buf = Buffer.concat([buf, Buffer.alloc(16 - buf.length)]);
        buf = encryption.Encrypt(buf);
    }

    callback = function(response) {
        // Analyze return code.
        if (response.readInt8(0) === 0) {
            console.log('LED green on OK.');
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

app.get('/api/ledgreenon', function(req, res) {
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

app.get('/ledgreenblink', function(req, res) {
    var buf = Buffer.from([0x11, 0x00, 0x04, 0x02, 0x02, 0x10, 0x10]);

    if (encryptionEnabled) {
        buf = Buffer.concat([buf, Buffer.alloc(16 - buf.length)]);
        buf = encryption.Encrypt(buf);
    }

    callback = function(response) {
        // Analyze return code.
        if (response.readInt8(0) === 0) {
            console.log('LED green blink OK.');
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

app.get('/api/ledgreenblink', function(req, res) {
    var buf = Buffer.from([0x11, 0x00, 0x04, 0x02, 0x02, 0x10, 0x10]);

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

app.get('/ledgreenoff', function(req, res) {
    var buf = Buffer.from([0x11, 0x00, 0x02, 0x02, 0x00]);

    if (encryptionEnabled) {
        buf = Buffer.concat([buf, Buffer.alloc(16 - buf.length)]);
        buf = encryption.Encrypt(buf);
    }

    callback = function(response) {
        // Analyze return code.
        if (response.readInt8(0) === 0) {
            console.log('LED green off OK.');
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

app.get('/api/ledgreenoff', function(req, res) {
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

app.get('/ledredon', function(req, res) {
    var buf = Buffer.from([0x11, 0x00, 0x02, 0x01, 0x01]);

    if (encryptionEnabled) {
        buf = Buffer.concat([buf, Buffer.alloc(16 - buf.length)]);
        buf = encryption.Encrypt(buf);
    }

    callback = function(response) {
        // Analyze return code.
        if (response.readInt8(0) === 0) {
            console.log('LED red on OK.');
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

app.get('/api/ledredon', function(req, res) {
    var buf = Buffer.from([0x11, 0x00, 0x02, 0x01, 0x01]);

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

app.get('/ledredblink', function(req, res) {
    var buf = Buffer.from([0x11, 0x00, 0x04, 0x01, 0x02, 0x10, 0x10]);

    if (encryptionEnabled) {
        buf = Buffer.concat([buf, Buffer.alloc(16 - buf.length)]);
        buf = encryption.Encrypt(buf);
    }

    callback = function(response) {
        // Analyze return code.
        if (response.readInt8(0) === 0) {
            console.log('LED red blink OK.');
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

app.get('/api/ledredblink', function(req, res) {
    var buf = Buffer.from([0x11, 0x00, 0x04, 0x01, 0x02, 0x10, 0x10]);

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

app.get('/ledredoff', function(req, res) {
    var buf = Buffer.from([0x11, 0x00, 0x02, 0x01, 0x00]);

    if (encryptionEnabled) {
        buf = Buffer.concat([buf, Buffer.alloc(16 - buf.length)]);
        buf = encryption.Encrypt(buf);
    }

    callback = function(response) {
        // Analyze return code.
        if (response.readInt8(0) === 0) {
            console.log('LED red off OK.');
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

app.get('/api/ledredoff', function(req, res) {
    var buf = Buffer.from([0x11, 0x00, 0x02, 0x01, 0x00]);

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

    // This API does the similar things of /receive_template. Instead of
    // storing the template scanned, this API will give out HTTP response
    // with template binary data.

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
                res.json({
                    'response': 'ok',
                    'template': Array.from(response.slice(4, 540))
                });
            }
            else {
                template = false;
                res.json({
                    'response': 'error',
                    'errorMsg': 'Invalid checksum received.'
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
    if (templateNumber === 100) {
        templateNumber = 0;
    }

    var buf = Buffer.from([0x12, 0x02, 0x1d, templateNumber++]);

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

app.post('/api/send_template', jsonParser, function(req, res) {

    // This API does the similar things of /send_template. Instead of
    // sending the stored template, this API will accept HTTP request with
    // template binary data.

    if (templateNumber === 100) {
        templateNumber = 0;
    }

    var buf = Buffer.from([0x12, 0x02, 0x1d, templateNumber]);

    if (req.body.template.length === 536) {
        buf = Buffer.concat([buf, Buffer.from(req.body.template)]);
    }
    else {
        res.json({
            'response': 'error',
            'errorMsg': 'Invalid template data'
        });
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
            res.json({
                'response': 'ok',
                'templateNumber': templateNumber++
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
});

var listener = app.listen(8080, function() {
    console.log('Listening on port ' + listener.address().port);
});
