# Hitachi Finger Vein Device (H1E-USB) Application

## Basic Information
- Tested on:
  - Ubuntu 16.04.5 Desktop
  - Node.js 8.11.4 or 8.12.0
- Run "node-gyp rebuild" to compile C/C++ source files.
- Run "sudo node app.js" to start the application.
- Use web browser to access port 80 of the server to open the web interface, or
- Send HTTP GET / POST request to the REST API

## REST API Examples
### LED On
```
curl -H "Content-Type:application/json" "http://localhost/api/ledon"
```
```
{"response":"ok"}
```

### Sending Template
```
curl -H "Content-Type:application/json" -d@index_l.json http://localhost/api/send_template
```
```
{"response":"ok"}
```

### Verification (1 to N)
```
curl -H "Content-Type:application/json" http://localhost/api/verification_1toN
```
```
{"response":"ok","verifiedTemplateNumber":4}
```
