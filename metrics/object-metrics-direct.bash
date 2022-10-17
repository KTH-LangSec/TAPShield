#!/bin/bash

dir='metrics'



# Clear responses
> "$dir/object_metrics_direct_nc_responses.txt"

# Start netcat listener and redicret output to file
nc -l -k 9999 >> "$dir/object_metrics_direct_nc_responses.txt" &

# Start the object detector flow natively
node main.js > "$dir/object_metrics_direct_output.txt"  &

sleep 5 # Wait for the flow to start
# Run object detection n times
for i in {1..1000}; do
    # Run object detection through netcat
    echo "Running object detection $i"
    
    nc -N localhost 9998 < dogs.jpg

    # Count number of lines in responses
    n=$(wc -l < $dir/object_metrics_direct_nc_responses.txt) 
    
    # wait for responses
    
    while ((n < i)); do
        sleep 0.5
        n=$(wc -l < $dir/object_metrics_direct_nc_responses.txt) 
    done
done


# Kill netcat listener
kill -9 $(pgrep -f "nc")
kill -9 $(pgrep -f "node main.js")