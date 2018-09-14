# Hitachi Finger Vein Device (H1E-USB) Application

## Basic Information
- Tested on:
  - Ubuntu 16.04.5 Desktop
  - Node.js 8.11.4 or 8.12.0
  - node-gyp 3.8.0
- Run "node-gyp rebuild" to compile C/C++ source files.
- Run "sudo node app.js" to start the application.
- Use web browser to access port 80 of the server to open the web interface, or
- Send HTTP GET / POST request to the REST API.

## REST API List
### LED On
```
curl -w "\n" -H "Content-Type:application/json" "http://localhost/api/ledon"
```
```
{"response":"ok"}
```

### LED Off
```
curl -w "\n" -H "Content-Type:application/json" "http://localhost/api/ledoff"
```
```
{"response":"ok"}
```

### Sending encryption key
```
curl -w "\n" -H "Content-Type:application/json" "http://localhost/api/send_encryption_key"
```
```
{"response":"ok"}
```

### Receiving template
```
curl -w "\n" -H "Content-Type:application/json" "http://localhost/api/receive_template"
```
```
{"response":"ok","template":[55,43,50,90,39,4,94,61,122,60,95,21,31,48,73,32,73,98,120,116,88,125,45,96,36,29,99,70,40,48,32,57,110,10,37,65,80,118,4,121,33,24,43,65,90,56,20,79,13,34,103,79,109,31,113,110,86,117,120,115,11,127,70,113,62,113,48,78,100,61,56,113,120,78,27,48,120,41,111,103,66,5,30,83,11,107,114,90,52,101,80,11,110,54,118,61,99,84,121,125,101,112,121,9,0,80,53,12,81,76,97,99,11,8,12,4,49,85,83,9,33,18,39,72,108,23,115,66,29,117,33,67,22,111,71,4,1,59,117,127,86,11,66,25,102,92,36,95,76,126,88,116,17,100,21,26,89,34,55,34,6,126,102,41,51,51,31,127,62,36,35,69,17,97,127,31,81,15,24,111,18,30,33,52,47,23,94,77,37,118,78,85,96,84,81,42,60,105,40,68,117,96,83,46,55,40,39,51,85,17,14,34,67,13,33,53,123,5,61,99,104,60,58,77,61,69,46,64,51,47,74,123,122,55,59,4,1,123,30,74,52,123,67,80,54,102,80,114,29,9,39,36,23,98,12,8,101,70,94,94,6,86,34,19,11,87,62,61,51,24,42,123,84,97,83,61,41,112,14,64,67,75,94,122,126,42,30,108,82,31,92,121,88,112,30,6,116,81,85,125,30,127,125,119,4,109,92,66,9,26,22,4,67,48,10,53,124,84,83,37,21,59,49,87,15,51,31,62,26,28,78,39,73,36,41,56,4,60,69,85,64,52,88,33,22,114,28,73,13,96,100,117,23,37,96,68,123,59,93,67,63,104,39,8,118,48,118,123,54,108,16,30,77,114,19,100,102,27,25,31,98,78,106,17,102,88,78,84,11,26,65,55,33,84,82,87,113,107,115,95,93,45,89,54,81,0,57,42,96,20,116,93,6,105,55,11,1,87,92,52,40,88,39,57,10,68,7,62,25,31,37,105,9,101,14,20,108,76,121,110,51,90,10,92,46,127,30,58,97,31,39,27,102,18,92,57,81,12,23,17,8,74,85,92,14,57,20,80,118,104,106,12,38,5,119,70,40,104,3,119,113,92,112,62,51,42,98,27,3,49,37,17,78,21,117,17,5,3,124,100,43,57,46,103,18,16,74,34,21,47,62,82,48,49,7,58,43,38,108,12,87,43,1,45,61,58,91,75,0,0,0,0,0,0,0,0]}
```

### Sending Template
```
curl -w "\n" -H "Content-Type:application/json" -d@index_l.json http://localhost/api/send_template
```
```
{"response":"ok","templateNumber":3}
```

### Verification (1 to N)
```
curl -w "\n" -H "Content-Type:application/json" http://localhost/api/verification_1toN
```
```
{"response":"ok","verifiedTemplateNumber":4}
```

### Resetting device
```
curl -w "\n" -H "Content-Type:application/json" http://localhost/api/reset
```
```
{"response":"ok"}
```

## Limitations
- Hard-coded encryption key.
- Supports storing 100 templates on device only. Storing the 101st template will overwrite the oldest one.
