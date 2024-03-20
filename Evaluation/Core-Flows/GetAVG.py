import os
from collections import defaultdict

current_directory = os.scandir(".")
def parse_file(file_path):
    node_exec_times = defaultdict(list)

    with open(file_path, 'r') as file:
        lines = file.readlines()
        for line in lines:
            if 'ms' in line:
                node_name, exec_time = line.split(':')
                node_name = node_name.strip()
                exec_time = exec_time.strip().replace('ms', '')
                node_exec_times[node_name].append(float(exec_time))

    avg_exec_times = {}
    for node, exec_times in node_exec_times.items():
        avg_time = sum(exec_times) / len(exec_times)
        avg_exec_times[node] = avg_time

    print(f"File: {os.path.basename(file_path)}")
    add_up = 0
    
    for node, avg_time in avg_exec_times.items():
        print(f"    Node: {node}, Average Execution Time: {avg_time:.3f}ms")
        add_up += avg_time
    print(f"Total execution time is {add_up:.3f}")
    total_time.append(add_up)
    print()


for input_directory in current_directory:
    if input_directory.is_dir():
        total_time = []
        for filename in os.listdir(input_directory):
            if filename.endswith('ct.log'): 
                file_path = os.path.join(input_directory, filename)
                parse_file(file_path)
        print(f"================Average execution time of {input_directory} is {sum(total_time)/len(total_time):.3f}================")