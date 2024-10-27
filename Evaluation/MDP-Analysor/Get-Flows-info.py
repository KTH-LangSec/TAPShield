import time 
from selenium import webdriver 
from selenium.webdriver.chrome.service import Service as ChromeService 
from webdriver_manager.chrome import ChromeDriverManager 
from selenium.webdriver.common.by import By
from collections import Counter 
from selenium.webdriver.chrome.options import Options
import json
import re 
import os 
chrome_options = Options()
chrome_options.add_argument("--headless")  # Run Chrome in headless mode
chrome_options.add_argument("--no-sandbox")  # Bypass OS security model
chrome_options.add_argument("--disable-dev-shm-usage")  # Overcome limited resource problems
nodes = []

def add_to_json_file(filename, key, values):
    
    if os.path.exists(filename):
        with open(filename, 'r') as json_file:
            data = json.load(json_file)
    else:
        data = {}
    if key in data:
        data[key].extend(values)
    else:
        data[key] = values
    with open(filename, 'w') as json_file:
        json.dump(data, json_file, indent=4)



def CrawlFlowPage(urls):
    driver = webdriver.Chrome(service=ChromeService( 
	ChromeDriverManager().install()), options=chrome_options) 
    for link in urls: 
        print(urls.index(link), link)
        key = link.strip()
        values = {}
        values["core_nodes"] = []
        values["third_party_nodes"] = []
        driver.get(link.strip()) 
        time.sleep(10)
        elements = driver.find_elements(By.CLASS_NAME ,"nodeTypeList")
        core_li_elements = []
        third_party_li_element = []
        if (len(elements)!=0):
            for l in elements:
                if (elements.index(l)== 0):
                    core_li_elements.extend(l.find_elements(By.TAG_NAME, "li"))
                else:
                    third_party_li_element.extend(l.find_elements(By.TAG_NAME, "li"))
    
        for li in core_li_elements:
            try:
                values["core_nodes"].append(re.sub(r'\(.*?\)', '', li.text).strip())
            except Exception as e:
                print(e)
        for li in third_party_li_element:
            try:
                values["third_party_nodes"].append(re.sub(r'\(.*?\)', '', li.text).strip())
            except Exception as e:
                print(e)
        print(values)
        add_to_json_file('Flows-Informations.json', key=key , values=values)

    



urls = [] 
url = 'https://flows.nodered.org/search?type=flow&sort=downloads&page=' 
 



driver = webdriver.Chrome(service=ChromeService( 
	ChromeDriverManager().install()), options=chrome_options) 
 


# for i in range(1,187):
#     print("page:" , i)
#     driver.get(url+str(i)) 
#     time.sleep(8)
#     elements = driver.find_elements(By.XPATH ,"//a[@href]")
#     href_values = [element.get_attribute("href") for element in elements]
#     for href in href_values:
#         if ("flow/" in href):
#             # print(href)
#             with open("All_Flows.log", 'a') as file:
#                 file.write(href+'\n')
with open("All_Flows.log", 'r') as file: 
        urls = file.readlines()
            # urls.append(href)

driver.quit()

CrawlFlowPage(urls)