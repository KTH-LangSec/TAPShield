#!/bin/bash

dir='metrics'

# Kill gramine first so no port errors:
kill -9 $(pgrep -f "gramine/sgx")

> udp-responses.txt # Clear output file

# Listen for udp messages

# Start gramine sgx in background and run for 200 seconds:
> gramine.log && gramine-sgx nodejs main.js > "$dir/udp_metrics_sgx_output.txt"  &

nc -u -l localhost 1881 >> udp-responses.txt &

a=$(wc -w < udp-responses.txt) 

while ((a < 1000)); do
    echo "a=$a"
    sleep 1
    a=$(wc -w < udp-responses.txt) 
done

# Kill gramine
kill -9 $(pgrep -f "gramine/sgx")
kill -9 $(pgrep -f "nc")

# Remove temporary udp-responses.txt
rm -f udp-responses.txt 