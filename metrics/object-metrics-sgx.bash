#!/bin/bash

dir='metrics'

# Kill gramine first so no port errors:
kill -9 $(pgrep -f "gramine/sgx")

# Clear responses

> "$dir/object_metrics_sgx_nc_responses.txt"
# Start netcat listener and redicret output to file
nc -l -k 9999 >> "$dir/object_metrics_sgx_nc_responses.txt" &

# Start the object detector flow
> gramine.log &&  gramine-sgx nodejs main.js > "$dir/object_metrics_sgx_output.txt"  &

sleep 10 # Wait for the flow to start
# Run object detection n times
for i in {1..1000}; do
    # Run object detection through netcat
    echo "Running object detection $i"
    
    nc -N localhost 9998 < dogs.jpg

    # Count number of lines in responses
    n=$(wc -l < $dir/object_metrics_sgx_nc_responses.txt) 
    
    # wait for responses
    
    while ((n < i)); do
        sleep 0.5
        n=$(wc -l < $dir/object_metrics_sgx_nc_responses.txt) 
    done
done


# Kill gramine and netcat listener
kill -9 $(pgrep -f "gramine/sgx")
kill -9 $(pgrep -f "nc")