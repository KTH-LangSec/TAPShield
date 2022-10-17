#!/bin/bash

dir='metrics'

# Start gramine direct in background and run for 200 seconds:
node main.js > "$dir/exec_metrics_direct_output.txt"  &

> monitor-output.txt # Clear output file

a=$(wc -l < monitor-output.txt) 

while ((a < 1000)); do
    sleep 1
    a=$(wc -l < monitor-output.txt) 
done

kill -9 $(pgrep -f "nodejs main.js")