#!/bin/sh

## May need to customize the commands below for tests.

## Not including receive_template and verification_1toN as they need human interaction.

curl -H "Content-Type:application/json" "http://localhost/api/reset"
curl -H "Content-Type:application/json" "http://localhost/api/ledon"
curl -H "Content-Type:application/json" "http://localhost/api/ledoff"
curl -H "Content-Type:application/json" "http://localhost/api/send_encryption_key"
curl -H "Content-Type:application/json" -d@/home/eric/index_l.json "http://localhost/api/send_template"
curl -H "Content-Type:application/json" -d@/home/eric/middle_l.json "http://localhost/api/send_template"
curl -H "Content-Type:application/json" -d@/home/eric/ring_l.json "http://localhost/api/send_template"
curl -H "Content-Type:application/json" -d@/home/eric/pinky_l.json "http://localhost/api/send_template"
