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


class FlowCrawler:
    def __init__(self, base_url, json_filename, headless=True):
        self.base_url = base_url
        self.json_filename = json_filename
        self.chrome_options = Options()
        if headless:
            self.chrome_options.add_argument("--headless") 
        self.chrome_options.add_argument("--no-sandbox")  
        self.chrome_options.add_argument("--disable-dev-shm-usage")  
        self.driver = None

    def start_driver(self):
        self.driver = webdriver.Chrome(
            service=ChromeService(ChromeDriverManager().install()), options=self.chrome_options
        )

    def quit_driver(self):
        if self.driver:
            self.driver.quit()

    def add_to_json_file(self, key, values):
        if os.path.exists(self.json_filename):
            with open(self.json_filename, 'r') as json_file:
                data = json.load(json_file)
        else:
            data = {}
        if key in data:
            data[key].extend(values)
        else:
            data[key] = values
        with open(self.json_filename, 'w') as json_file:
            json.dump(data, json_file, indent=4)

    def crawl_flow_page(self, urls):
        for link in urls:
            print(urls.index(link), link)
            key = link.strip()
            values = {"core_nodes": [], "third_party_nodes": []}
            self.driver.get(link.strip())
            time.sleep(10)

            elements = self.driver.find_elements(By.CLASS_NAME, "nodeTypeList")
            core_li_elements = []
            third_party_li_element = []
            if len(elements) != 0:
                for l in elements:
                    if elements.index(l) == 0:
                        core_li_elements.extend(l.find_elements(By.TAG_NAME, "li"))
                    else:
                        third_party_li_element.extend(l.find_elements(By.TAG_NAME, "li"))

            for li in core_li_elements:
                try:
                    values["core_nodes"].append(re.sub(r'\(.*?\)', '', li.text).strip())
                except Exception as e:
                    print(f"Error processing core node: {e}")

            for li in third_party_li_element:
                try:
                    values["third_party_nodes"].append(re.sub(r'\(.*?\)', '', li.text).strip())
                except Exception as e:
                    print(f"Error processing third-party node: {e}")

            print(values)
            self.add_to_json_file(key=key, values=values)

    def load_urls_from_log(self, log_filename):
        with open(log_filename, 'r') as file:
            return file.readlines()


class SubflowAnalyzer:
    def __init__(self, json_filename):
        self.json_filename = json_filename

    def subflow_container(self):
        if os.path.exists(self.json_filename):
            with open(self.json_filename, 'r') as json_file:
                data = json.load(json_file)
        else:
            print("File does not exist")
            return

        all_subflows = []
        for l in data:
            if len(data[l]['third_party_nodes']) != 0:
                is_subflow = all('subflow' in node for node in data[l]['third_party_nodes'])
                if is_subflow:
                    all_subflows.append(l)

        print(f"Total subflows found: {len(all_subflows)}")
        return all_subflows







if __name__ == "__main__":
    # Step 1: Crawl Flows
    # base_url = 'https://flows.nodered.org/search?type=flow&sort=downloads&page='
    # log_filename = "All_Flows.log"
    json_filename = "Flows-Informations.json"

    # crawler = FlowCrawler(base_url, json_filename)
    # crawler.start_driver()

    # # Load URLs from log and crawl the pages
    # urls = crawler.load_urls_from_log(log_filename)
    # crawler.crawl_flow_page(urls)

    # # Quit the driver after crawling is done
    # crawler.quit_driver()

    # Step 2: Analyze for subflows
    analyzer = SubflowAnalyzer(json_filename)
    analyzer.subflow_container()
