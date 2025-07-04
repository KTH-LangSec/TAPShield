#!/bin/bash

dir='metrics'

> mqtt-responses.txt # Clear output file

> gramine.log && gramine-sgx nodejs main.js >> "$dir/mqtt_metrics_sgx_output.txt"  &

sleep 10 # Wait for node-red to start

# Start mosquitto_sub 
mosquitto_sub -t "#" -v > mqtt-responses.txt &

a=$(wc -l < mqtt-responses.txt) 

while ((a < 1000)); do
    echo "a=$a"
    sleep 1
    a=$(wc -l < mqtt-responses.txt) 
done


# Kill gramine
kill -9 $(pgrep -f "gramine/sgx")
kill -9 $(pgrep -f "mosquitto_sub")

# Remove temporary mqtt-responses.txt
rm -f mqtt-responses.txt 