import time 
from selenium import webdriver 
from selenium.webdriver.chrome.service import Service as ChromeService 
from webdriver_manager.chrome import ChromeDriverManager 
from selenium.webdriver.common.by import By
from collections import Counter 
import re 

nodes = []

def CrawlFlowPage(urls):
    driver = webdriver.Chrome(service=ChromeService( 
	ChromeDriverManager().install())) 
    for link in urls: 
        driver.get(link) 
        time.sleep(5)
        elements = driver.find_elements(By.CLASS_NAME ,"nodeTypeList")
        li_elements = []
        if (len(elements)!=0):
            for l in elements:
                li_elements.extend(l.find_elements(By.TAG_NAME, "li"))
        total_node_number = 0 
        for li in li_elements:
            try:
                
                node_number = int(re.findall(r'\d+',li.text.split(" ")[-1].split("x")[-1])[0])
                total_node_number += node_number
                
            except:
                print("error happened")
        print("total is " , total_node_number)
        nodes.append((link,total_node_number))
    print(nodes)
    print("Sorted data : ")
    print(sorted(nodes, key=lambda tup: (tup[1]) , reverse=True))
    



urls = [] 
url = 'https://flows.nodered.org/search?type=flow&sort=downloads&page=' 
 
driver = webdriver.Chrome(service=ChromeService( 
	ChromeDriverManager().install())) 
 


for i in range(1,100):
    driver.get(url+str(i)) 
    time.sleep(8)
    elements = driver.find_elements(By.XPATH ,"//a[@href]")
    href_values = [element.get_attribute("href") for element in elements]
    for href in href_values:
        if ("flow/" in href):
            print(href)
            urls.append(href)

driver.quit()

CrawlFlowPage(urls)
