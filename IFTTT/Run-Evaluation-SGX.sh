#!/bin/bash


mkdir -p logs
basedir="logs/"
for j in {1..10}
do
  mkdir -p "${basedir}/${j}"
  for i in {1..25}
  do

  
    echo "Run the evaluation for ${i}.json : execution number : ${j}"	  

    gramine-sgx node invoker.js $i -v
  done
  cp logs/*.log "${basedir}/${j}"
  rm logs/*.log
done

echo "All commands executed and logs stored in the 'logs' directory."

