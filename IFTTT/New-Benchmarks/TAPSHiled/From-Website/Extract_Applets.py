import json
import requests
import re
import os

def extract_applet_ids(json_file):
    """Extract applet IDs and their corresponding links from a JSON file."""
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
    """Query IFTTT API to get applet configuration and filter code."""
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

if __name__ == "__main__":
    main()
