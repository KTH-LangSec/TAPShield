import re
import os
import glob

def parse_log(file_content):
    iterations = file_content.split('**')
    iteration_averages = []

    for iteration in iterations:
        lines = iteration.strip().split('\n')
        total_time = 0
        count = 0
        for line in lines:
            match = re.match(r'^\s*\w+:\s*([\d.]+)ms\s*$', line)
            if match:
                execution_time = float(match.group(1))
                # print(execution_time)
                total_time += execution_time
                count += 1
            
        # print("-----------")
        if count > 0:
            average_time = total_time / count
            iteration_averages.append(average_time)
            # print(iteration_av###erages)
            
    print(len(iteration_averages),"###")
    return iteration_averages

def process_logs(log_dir, output_file):
    log_files = glob.glob(os.path.join(log_dir, '*.log'))

    results = {}

    for log_file in log_files:
        with open(log_file, 'r') as f:
            content = f.read()
            print(log_file)
            iteration_averages = parse_log(content)
            overall_average = sum(iteration_averages) / len(iteration_averages) if iteration_averages else 0
            results[log_file] = overall_average
            # print(results)
            # break;

    with open(output_file, 'w') as f:
        for log_file, avg_time in results.items():
            f.write(f'Log File: {log_file}\n')
            f.write(f'Average Iteration Time: {avg_time:.3f}ms\n\n')

log_directory = '.'
output_file = 'average_iteration_times.txt'
process_logs(log_directory, output_file)
