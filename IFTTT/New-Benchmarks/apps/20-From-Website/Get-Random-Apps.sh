#!/bin/bash


SOURCE_DIR="/home/rof13thfloor/work/TAPShield/TAPShield/IFTTT/New-Benchmarks/TAPSHiled/From-Website/WEbsite-DS/Randomly-selected"

# Destination directory (change this to your target directory)
DEST_DIR="/home/rof13thfloor/work/TAPShield/TAPShield/IFTTT/New-Benchmarks/TAPSHiled/From-Website/WEbsite-DS/RQ1-apps"

# Number of files to extract
NUM_FILES=10

# Check if source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo "Error: Source directory does not exist."
    exit 1
fi

# Check if destination directory exists, if not create it
if [ ! -d "$DEST_DIR" ]; then
    mkdir -p "$DEST_DIR"
fi

# Randomly select 10 apps from mintap
shuf -n "$NUM_FILES" -e "$SOURCE_DIR"/* | while read -r file; do
    cp "$file" "$DEST_DIR"  
done

echo "Extracted $NUM_FILES files to $DEST_DIR."

