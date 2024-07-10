import os
import re

def parse_memory_log(file_path):
    current_memories = []
    peak_memory = 0

    with open(file_path, 'r') as file:
        for line in file:
            if line.startswith('memusg'):
                match = re.search(r'current=(\d+) KB, peak=(\d+) KB', line)
                if match:
                    current_memory = int(match.group(1))
                    peak = int(match.group(2))

                    current_memories.append(current_memory)
                    
                    peak_memory = peak

    average_current_memory = sum(current_memories) / len(current_memories) if current_memories else 0
    return average_current_memory, peak_memory

def process_all_logs(directory):
    results = []

    for filename in os.listdir(directory):
        if filename.endswith('.log'):
            file_path = os.path.join(directory, filename)
            average_current, peak = parse_memory_log(file_path)
            results.append((filename, average_current, peak))
    
    return results

def write_results_to_file(results, output_file):
    with open(output_file, 'w') as file:
        file.write("Filename, Average current memory (KB), Peak memory (KB)\n")
        for filename, average_current, peak in results:
            file.write(f"{filename}, {average_current}, {peak}\n")

directory = '.'
output_file = 'Final_Memory_Consumption.csv'
results = process_all_logs(directory)
write_results_to_file(results, output_file)
print(f"Results written to {output_file}")
