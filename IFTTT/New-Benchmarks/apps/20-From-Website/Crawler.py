import requests
from bs4 import BeautifulSoup

url = "https://ifttt.com/explore/top-applets-2024"

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
}

response = requests.get(url, headers=headers)

if response.status_code == 200:
    soup = BeautifulSoup(response.text, "html.parser")
    
  
    applet_links = []
    for li in soup.find_all("li"):
        a_tag = li.find("a", href=True)
        
        if a_tag:
            href = a_tag["href"]
            
            if href.find("/applets/"):
                full_url = f"https://ifttt.com{href}"
                applet_links.append(full_url)

    for link in applet_links:
        print(link)
else:
    print(f"Failed to fetch the webpage. Status Code: {response.status_code}")
