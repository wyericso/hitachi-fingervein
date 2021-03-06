# Hitachi Finger Vein Device (H1E-USB) API

## Basic Information
- Tested on:
```
|---------------------------|-----------|-----------|
| OS                        | Node.js   | node-gyp  |
|---------------------------|-----------|-----------|
| Ubuntu 18.04.1 Desktop    | 10.13.0   | 3.8.0     |
|---------------------------|-----------|-----------|
| Ubuntu 16.04.5 Desktop    | 8.12.0    | 3.8.0     |
|---------------------------|-----------|-----------|
| Ubuntu 16.04.5 Desktop    | 8.11.4    | 3.8.0     |
|---------------------------|-----------|-----------|
```
- Run "node-gyp rebuild" to compile C/C++ source files.
- Run "sudo node app.js" to start the application.
- Use web browser to access port 8080 of the server to open the web interface, or
- Send HTTP GET / POST request to the REST API.

## Instructions
- Change the path of the finger vein device before running this application.
It is now hardcoded as `/dev/ttyACM0` in:
```
var port = new SerialPort('/dev/ttyACM0', function (err) {
    if (err) {
        return console.log('Error: ', err.message);
    }
});
```

## REST API List
### LED Green On
```
curl -w "\n" -H "Content-Type:application/json" "http://localhost:8080/api/ledgreenon"
```
```
{"response":"ok"}
```

### LED Green Blink
```
curl -w "\n" -H "Content-Type:application/json" "http://localhost:8080/api/ledgreenblink"
```
```
{"response":"ok"}
```

### LED Green Off
```
curl -w "\n" -H "Content-Type:application/json" "http://localhost:8080/api/ledgreenoff"
```
```
{"response":"ok"}
```

### LED Red On
```
curl -w "\n" -H "Content-Type:application/json" "http://localhost:8080/api/ledredon"
```
```
{"response":"ok"}
```

### LED Red Blink
```
curl -w "\n" -H "Content-Type:application/json" "http://localhost:8080/api/ledredblink"
```
```
{"response":"ok"}
```

### LED Red Off
```
curl -w "\n" -H "Content-Type:application/json" "http://localhost:8080/api/ledredoff"
```
```
{"response":"ok"}
```

### Sending encryption key
```
curl -w "\n" -H "Content-Type:application/json" "http://localhost:8080/api/send_encryption_key"
```
```
{"response":"ok"}
```

### Receiving template
```
curl -w "\n" -H "Content-Type:application/json" "http://localhost:8080/api/receive_template"
```
```
{"response":"ok","template":[42,222,171,194,142,241,128,105,150,92,10,115,193,54,209,207,160,116,149,91,87,168,63,202,239,242,130,19,176,151,227,143,93,193,215,76,218,42,75,76,218,240,231,38,205,100,15,155,226,178,48,94,94,189,163,161,89,133,55,223,240,5,162,218,140,249,3,55,1,50,14,55,230,180,98,119,212,11,135,63,244,37,116,164,109,133,124,59,10,25,184,101,29,203,113,215,129,132,182,48,163,19,175,6,16,151,245,145,56,159,60,154,101,235,118,203,6,121,220,110,101,123,228,173,150,63,197,124,163,74,55,94,95,222,114,126,251,67,153,16,29,108,131,7,146,175,22,199,53,210,199,240,111,56,12,186,51,151,226,113,36,42,248,67,109,15,188,140,158,98,248,114,209,179,16,167,217,203,194,104,234,204,3,31,21,109,11,20,207,8,123,168,202,177,99,242,152,238,0,188,28,220,80,79,198,137,223,166,252,115,106,37,36,228,226,106,37,202,234,156,170,149,253,130,146,253,10,182,117,107,243,150,132,50,15,115,118,227,247,20,70,139,172,83,39,226,86,69,35,64,139,24,19,17,216,68,193,166,75,40,67,28,104,84,239,83,66,150,78,4,18,20,47,91,71,253,178,85,1,6,243,143,33,105,87,117,21,232,202,143,222,72,248,94,191,88,63,173,231,203,6,74,69,63,239,56,75,2,106,186,144,116,21,60,186,195,3,183,73,51,44,180,222,152,30,156,174,1,7,204,214,193,20,9,87,141,202,165,205,192,37,209,248,182,111,108,212,28,97,154,71,192,117,37,75,154,195,190,16,29,59,221,99,131,105,165,58,252,89,61,1,100,199,112,102,28,107,250,230,224,171,127,22,10,91,112,36,36,139,58,163,162,7,193,16,193,222,46,223,175,91,162,44,226,126,203,134,94,226,194,185,244,14,192,27,189,101,235,77,2,118,40,188,210,219,238,227,7,230,226,131,31,77,211,64,22,204,242,29,57,202,139,136,122,80,183,236,42,169,221,173,237,219,124,251,172,18,216,80,60,182,16,219,120,255,120,33,158,76,132,219,53,200,50,160,27,60,18,41,125,16,35,79,98,126,251,255,148,110,245,220,195,219,162,14,116,78,126,225,238,203,121,143,186,97,99,77,213,231,57,60,62,3,91,88,227,254,146,27,225,192,16,12,180,100,189,181,113,0,0,0,0,0,0,0,0]}
```

### Sending Template
```
curl -w "\n" -H "Content-Type:application/json" -d@index_l.json http://localhost:8080/api/send_template
```
```
{"response":"ok","templateNumber":3}
```

### Verification (1 to N)
```
curl -w "\n" -H "Content-Type:application/json" http://localhost:8080/api/verification_1toN
```
```
{"response":"ok","verifiedTemplateNumber":4}
```

### Resetting device
```
curl -w "\n" -H "Content-Type:application/json" http://localhost:8080/api/reset
```
```
{"response":"ok"}
```

## Limitations
- Hard-coded encryption key.
- Supports storing 100 templates on device only. Storing the 101st template will overwrite the oldest one.

## Notes of Ubuntu and Node.js Upgrade
- After upgrading Ubuntu Desktop from 16.04.5 to 18.04.1 and Node.js from 8.12.0 to 10.13.0, ran `npm rebuild` to recover from below error.
```
Error: The module '/media/psf/Home/Documents/vscode/hitachi-fingervein/node_modules/@serialport/bindings/build/Release/bindings.node'
was compiled against a different Node.js version using
NODE_MODULE_VERSION 57. This version of Node.js requires
NODE_MODULE_VERSION 64. Please try re-compiling or re-installing
the module (for instance, using `npm rebuild` or `npm install`).
```

## Notes of Hitachi Finger Vein Device (H1E-USB) ##
- It is found that after plugging in the device to a computer, some error codes were sent out from the device indicating that there were firmware upgrade failures. It is advised to wait for 1 minute after plugging in the device, before starting this API.
- The shell script `init_device.sh` provided can be run to test if the device is responding correctly, before starting this API.
