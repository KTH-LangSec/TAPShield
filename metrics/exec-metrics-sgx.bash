#!/bin/bash

dir='metrics'

# Kill gramine first so no port errors:
kill -9 $(pgrep -f "gramine/sgx")

# Start gramine sgx in background and run for 200 seconds:
> gramine.log &&  gramine-sgx nodejs main.js > "$dir/exec_metrics_sgx_output.txt"  &

> monitor-output.txt # Clear output file

a=$(wc -l < monitor-output.txt) 

while ((a < 1000)); do
    sleep 1
    a=$(wc -l < monitor-output.txt) 
done

# Kill gramine
kill -9 $(pgrep -f "gramine/sgx")