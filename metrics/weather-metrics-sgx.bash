#!/bin/bash

dir='metrics'

# Kill gramine first so no port errors:
kill -9 $(pgrep -f "gramine/sgx")

# Start gramine sgx in background
> gramine.log && gramine-sgx nodejs main.js > "$dir/weather_metrics_sgx_output.txt"  &

sleep 10

# Clear log file:
> "$dir/weather_metrics_sgx_log.txt"

count=1000
for i in $(seq $count); do
    echo "Start iteration $i time: $(date +%s%3N)" >> "$dir/weather_metrics_sgx_log.txt"
    OUTPUT=$(curl  -k "https://localhost:8443/api/get-weather?city=stockholm")
    # Check that output contains 'The temperature in Stockholm is currently...'
    if [[ $OUTPUT == *"The temperature in Stockholm is currently"* ]]; then
        echo "End teration $i time: $(date +%s%3N)" >> "$dir/weather_metrics_sgx_log.txt"
    else
        echo "ERROR in iteration $i"
        break
    fi
    sleep 1
done


# Kill gramine
kill -9 $(pgrep -f "gramine/sgx")