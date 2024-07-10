#!/bin/bash

# Ensure the logs directory exists
# Select Mode (-v -s -o ) based on the assumption
mkdir -p logs
basedir="logs/"
for j in {1..10}
do
  mkdir -p "${basedir}/${j}"
# Loop through numbers 1 to 25
  for i in {1..25}
  do
  # Loop to run the application 10 times for each number
  
    echo "Run the evaluation for ${i}.json : execution number : ${j}"	  
    # Run With SGX 
    # gramine-sgx node invoker.js $i -o 
    # Run With SGX + SandTrap 
    # gramine-sgx node invoker.js $i -s
    # Run With SGX+VM2 Module 
    gramine-sgx node invoker.js $i -v
  done
  cp logs/*.log "${basedir}/${j}"
  rm logs/*.log
done

echo "All commands executed and logs stored in the 'logs' directory."

