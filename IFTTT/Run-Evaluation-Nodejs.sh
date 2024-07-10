#!/bin/bash

# Ensure the logs directory exists
mkdir -p logs

# Loop through numbers 1 to 25
for i in {1..25}
do
  # Loop to run the application 10 times for each number
  for j in {1..10}
  do
    echo "Run the evaluation for ${i}.json 10 times"	  
    # Run the application with the current number and save the output to the corresponding log file
    node invoker.js $i -o 
  done
done

echo "All commands executed and logs stored in the 'logs' directory."

