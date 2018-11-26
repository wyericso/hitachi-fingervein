#!/bin/sh

RC=1

while [ $RC != 0 ]
do
    curl -m 1 -w "\n" -H "Content-Type:application/json" "http://localhost:8080/api/ledgreenon"
    curl -m 1 -w "\n" -H "Content-Type:application/json" "http://localhost:8080/api/ledgreenoff"
    curl -m 1 -w "\n" -H "Content-Type:application/json" "http://localhost:8080/api/reset"
    RC=$?
    sleep 5
done
