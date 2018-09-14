#!/bin/sh

##
## - May need to customize the commands below for tests.
## - Expected all showing '{"response":"ok"}'.
## - Not including receive_template and verification_1toN as they need human interaction.
##

curl -w "\n" -H "Content-Type:application/json" "http://localhost/api/reset"
curl -w "\n" -H "Content-Type:application/json" "http://localhost/api/ledon"
curl -w "\n" -H "Content-Type:application/json" "http://localhost/api/ledoff"
curl -w "\n" -H "Content-Type:application/json" "http://localhost/api/send_encryption_key"
curl -w "\n" -H "Content-Type:application/json" -d@/home/eric/index_l.json "http://localhost/api/send_template"
curl -w "\n" -H "Content-Type:application/json" -d@/home/eric/middle_l.json "http://localhost/api/send_template"
curl -w "\n" -H "Content-Type:application/json" -d@/home/eric/ring_l.json "http://localhost/api/send_template"
curl -w "\n" -H "Content-Type:application/json" -d@/home/eric/pinky_l.json "http://localhost/api/send_template"
