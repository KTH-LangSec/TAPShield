import json
import requests
import re
import os
import random
def extract_applet_ids(json_file):
    with open(json_file, 'r', encoding='utf-8') as file:
        data = json.load(file)
    
    applet_data = []
    for url in data.get("applets", []):
        match = re.search(r'ifttt\.com/applets/([a-zA-Z0-9]+)-', url)
        if match:
            applet_id = match.group(1)
            applet_data.append({"id": applet_id, "link": url})
    
    return applet_data

def query_ifttt_applet(applet_id):
    
    url = "https://ifttt.com/api/v3/graph"
    headers = {'Content-Type': 'application/json; charset=utf-8'}
    data = {
        "query": """
        query($applet_id:String!){
            applet(id:$applet_id){
                id name description published archived filter_code 
                channel_id applet_trigger{
                    channel_module_name module_name 
                    fields{name custom_label hidden default_value_json}
                }
                applet_actions{
                    channel_module_name module_name 
                    fields{name custom_label hidden default_value_json}
                }
                applet_queries{
                    channel_module_name module_name 
                    fields{name custom_label hidden default_value_json}
                }
            }
        }
        """,
        "variables": {"applet_id": applet_id}
    }
    response = requests.post(url, headers=headers, data=json.dumps(data))
    
    if response.status_code == 200:
        result = response.json()
        if "data" in result and "applet" in result["data"]:
            return result["data"]["applet"]
    return None

def main():
    json_file = "applets.json"  
    applets = extract_applet_ids(json_file)
    
    os.makedirs("applets", exist_ok=True)
    
    for index, applet in enumerate(applets, start=1):
        applet_data = query_ifttt_applet(applet["id"])
        if applet_data:
            applet_data["Link"] = applet["link"]  
            file_path = os.path.join("applets", f"{index}.json")
            with open(file_path, 'w', encoding='utf-8') as file:
                json.dump(applet_data, file, indent=4)
        else:
            print(f"Failed to retrieve data for applet ID: {applet['id']}")




def select_random_files(directory, num_files=20):
    
    if not os.path.exists(directory):
        print(f"Directory '{directory}' does not exist.")
        return
    
    all_files = [f for f in os.listdir(directory) if os.path.isfile(os.path.join(directory, f))]
    
    if not all_files:
        print("No files found in the directory.")
        return
    
    selected_files = random.sample(all_files, min(num_files, len(all_files)))  # Ensure we don't exceed available files
    
    print("Selected Files:")
    for file in selected_files:
        print(file)







if __name__ == "__main__":
    # main()
    select_random_files('./applets')

# output of this function 
"""
['1.json', '3.json', '4.json', '5.json', '6.json', '10.json', 
'12.json', '13.json', '16.json', '20.json', '21.json', '24.json',
 '25.json', '26.json', '34.json', '37.json', '41.json', '43.json',
'48.json', '51.json']
"""