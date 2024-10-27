import os 
import json 

def subflow_container(filename):
    if os.path.exists(filename):
        with open(filename, 'r') as json_file:
            data = json.load(json_file)
    else: 
        print("File does not exist")
    all_subflows = []
    for l in data:
        if(len(data[l]['third_party_nodes']) != 0 ):
            is_subflow = all('subflow' in node for node in data[l]['third_party_nodes'])
            if(is_subflow):
                all_subflows.append(l)
    print(len(all_subflows))
            
            

subflow_container("Flows-Informations.json")