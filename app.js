var express = require('express');
var app = express();

var SerialPort = require('serialport');
var port = new SerialPort('/dev/ttyACM0', function (err) {
    if (err) {
        return console.log('Error: ', err.message);
    }
});

port.on('data', function(data) {
    console.log('Data: ', data);
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/led', function(req, res) {
    port.write(Buffer.from([0x11, 0, 2, 2, 1]), function(err) {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
    });
    setTimeout(() => {
        port.write(Buffer.from([0x11, 0, 2, 2, 0]), function(err) {
            if (err) {
                return console.log('Error on write: ', err.message);
            }
        });
    }, 3000);
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/send_encryption_key', function(req, res) {
    const buf = Buffer.concat([Buffer.from([0x1F, 2, 0]), Buffer.alloc(512)]);
    console.log(buf);
    port.write(buf, function(err) {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
    });
    res.sendFile(__dirname + '/views/index.html');
});

var listener = app.listen(80, function() {
    console.log('Listening on port ' + listener.address().port);
    var crypto = require('crypto');

    for (var algorithm of [ 'CAMELLIA128',
                            'CAMELLIA-128-CBC',
                            'CAMELLIA-128-CFB',
                            'CAMELLIA-128-CFB1',
                            'CAMELLIA-128-CFB8',
                            'CAMELLIA-128-OFB',
                            'camellia128' ]) {
        console.log(algorithm);

    //    var algorithm = 'CAMELLIA-128-ECB';   // Decryption with this algorithm shows error.

        var password = Buffer.alloc(16);
        console.log(password);

        var decipher = crypto.createDecipher(algorithm, password);
        var decrypted = decipher.update('d1e1b68145c43d2f0acbb5a89258e89b', 'hex');
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        console.log(decrypted);
    }
});
