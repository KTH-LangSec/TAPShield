#!/bin/bash


dir='metrics' # Target dir for saving metrics data


# Start node process in the background
node main.js > "$dir/weather_metrics_direct_output.txt"  &

sleep 5

touch "$dir/weather_metrics_direct_log.txt"
# Clear log file:
> "$dir/weather_metrics_direct_log.txt"

count=1000
for i in $(seq $count); do
    echo "Start iteration $i time: $(date +%s%3N)" >> "$dir/weather_metrics_direct_log.txt"
    OUTPUT=$(curl  -k "https://localhost:8443/api/get-weather?city=stockholm")
    # Check that output contains 'The temperature in Stockholm is currently...'
    if [[ $OUTPUT == *"The temperature in Stockholm is currently"* ]]; then
        echo "End teration $i time: $(date +%s%3N)" >> "$dir/weather_metrics_direct_log.txt"
    else
        echo "ERROR in iteration $i"
        break
    fi
    sleep 1
done


# Kill bakground task
kill -9 $(pgrep -f "nodejs main.js")