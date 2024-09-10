#!/bin/bash


mkdir -p logs


for i in {1..25}
do

  for j in {1..10}
  do
    echo "Run the evaluation for ${i}.json 10 times"	  
    node invoker.js $i -o 
  done
done

echo "All commands executed and logs stored in the 'logs' directory."

