#!/bin/bash

dir='metrics'

# > files-responses.txt # Clear output file
#! TODO: Set large or small file size for output
node main.js >> "$dir/files_metrics_direct_output_small.txt"  &

sleep 3 # Wait for gramine to start

node files-listener.js >> files-responses.txt &

a=$(wc -l < files-responses.txt) 

while ((a < 1000)); do
    echo "a=$a"
    sleep 1
    a=$(wc -l < files-responses.txt) 
done


# Kill gramine
kill -9 $(pgrep -f "node main.js")
kill -9 $(pgrep -f "websocat")

# Remove temporary files-responses.txt
rm -f files-responses.txt 