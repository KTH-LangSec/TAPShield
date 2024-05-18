import os

base_dir = 'logs/SGX+SandTrap'

num_directories = 10
num_apps = 25
total_times = [0] * num_apps


for i in range(1, num_directories + 1):
    dir_path = os.path.join(base_dir, str(i))
    for j in range(1, num_apps + 1):
        
        if ((j != 7) and (j != 8) and (j != 14) and (j != 15) and (j != 17) and (j != 22) and (j != 23)):
            file_path = os.path.join(dir_path, f'output_{j}.log')
            with open(file_path, 'r') as file:
                execution_time = float(file.read().strip())
                total_times[j - 1] += execution_time
        
        else:
            continue

        

average_times = [total / num_directories for total in total_times]

for app_num, avg_time in enumerate(average_times, start=1):
    print(f'App {app_num}: Average Execution Time = {avg_time:.2f}')

