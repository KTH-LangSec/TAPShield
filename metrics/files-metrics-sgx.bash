#!/bin/bash

dir='metrics'

# Kill gramine first so no port errors:
kill -9 $(pgrep -f "gramine/sgx")

# > files-responses.txt # Clear output file
#! TODO: Set large or small file size for output

> gramine.log && gramine-sgx nodejs main.js >> "$dir/files_metrics_sgx_output_small.txt"  &

sleep 10 # Wait for gramine to start

node files-listener.js >> files-responses.txt &

a=$(wc -l < files-responses.txt) 

while ((a < 1000)); do
    # echo "a=$a"
    sleep 2
    a=$(wc -l < files-responses.txt) 
done

# Kill gramine
kill -9 $(pgrep -f "gramine/sgx")
kill -9 $(pgrep -f "websocat")

# Remove temporary files-responses.txt
rm -f files-responses.txt 