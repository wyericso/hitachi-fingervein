#!/bin/sh

##
## - May need to customize the commands below for tests.
## - Expected all showing '{"response":"ok"}'.
## - Not including receive_template and verification_1toN as they need human interaction.
##

curl -w "\n" -H "Content-Type:application/json" "http://localhost:8080/api/reset"
curl -w "\n" -H "Content-Type:application/json" "http://localhost:8080/api/ledon"
curl -w "\n" -H "Content-Type:application/json" "http://localhost:8080/api/ledoff"
curl -w "\n" -H "Content-Type:application/json" "http://localhost:8080/api/send_encryption_key"
curl -w "\n" -H "Content-Type:application/json" -d@/media/psf/Home/Downloads/fingervein/index_l.json "http://localhost:8080/api/send_template"
curl -w "\n" -H "Content-Type:application/json" -d@/media/psf/Home/Downloads/fingervein/middle_l.json "http://localhost:8080/api/send_template"
curl -w "\n" -H "Content-Type:application/json" -d@/media/psf/Home/Downloads/fingervein/ring_l.json "http://localhost:8080/api/send_template"
curl -w "\n" -H "Content-Type:application/json" -d@/media/psf/Home/Downloads/fingervein/pinky_l.json "http://localhost:8080/api/send_template"
