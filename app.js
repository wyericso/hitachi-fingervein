var express = require('express');
var app = express();

var SerialPort = require('serialport');
var port = new SerialPort('/dev/ttyACM0', function (err) {
    if (err) {
        return console.log('Error: ', err.message);
    }
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/led', function(req, res) {
    port.write(Buffer.from([17, 0, 2, 2, 1]), function(err) {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
    });
    setTimeout(() => {
        port.write(Buffer.from([17, 0, 2, 2, 0]), function(err) {
            if (err) {
                return console.log('Error on write: ', err.message);
            }
        });
    }, 3000);
    res.sendFile(__dirname + '/views/index.html');
});

var listener = app.listen(80, function() {
    console.log('Listening on port ' + listener.address().port);
});
