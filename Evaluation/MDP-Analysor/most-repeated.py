import json
from collections import Counter


with open('Flows-Informations.json', 'r') as file:
    data = json.load(file)


all_third_party_nodes = []


for url, nodes in data.items():
    third_party_nodes = nodes.get('third_party_nodes', [])
    all_third_party_nodes.extend(third_party_nodes) 
    


most_common_third_party_nodes = Counter(all_third_party_nodes)
print(most_common_third_party_nodes.most_common())

# print(most_common_third_party_nodes)
# Display the most repeated third_party_nodes along with their counts
# print("Most repeated third-party nodes:")
# for node, count in most_common_third_party_nodes:
    # print(f"{node}: {count} occurrences")
