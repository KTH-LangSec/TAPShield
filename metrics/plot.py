import json
import matplotlib.pyplot as plt
import numpy as np
data = None
# Opening JSON file
with open('results.json') as json_file:
    data = json.load(json_file)


def getEnv(env):  # Returns the environment data
    if env == "sgx":
        return "SGX"
    return "Linux"


def getNodeName(node):
    res = node.capitalize()
    if "(large)" in node:
        res = res.replace("(large)", "- Large")
    return res


def fixPrec(num):
    return "{:.2f}".format(num)


def printResultsTable(node):
    # Create Latex table for the results
    res = ""

    # res += "\\begin{table}[htb]\n"
    # res += "\\centering\n"
    # res += f"\\caption{{Performance evaluation - {getNodeName(node)}}}\n"
    # res += f"\\label{{tab:results-{node}}}\n"
    res += "\\def\\arraystretch{1.5}\n"
    res += "\\begin{tabular}{|l|l|l|}\n"
    res += "\\hline\n"
    res += "\\textbf{Metric} & \\textbf{Linux (ms)} & \\textbf{SGX (ms)} \\\\ \\hline \\hline  \n"
    measures = data[node]

    # Print median
    res += f"\\cellcolor{{gray!5}} $\mu$ & {fixPrec(measures['direct']['mean'])} & {fixPrec(measures['sgx']['mean'])} \\\\ \\hline \n"
    # Print standard deviation
    res += f"\\cellcolor{{gray!5}} $\sigma$ & {fixPrec(measures['direct']['std'])} & {fixPrec(measures['sgx']['std'])} \\\\ \\hline \n"
    # Print confidence interval
    res += f"\\cellcolor{{gray!5}} $C_I$ & {fixPrec(measures['direct']['confidenceInterval'])} & {fixPrec(measures['sgx']['confidenceInterval'])} \\\\ \\hline \n"
    # Print min and max
    res += f"\\cellcolor{{gray!5}} Min & {fixPrec(measures['direct']['min'])} & {fixPrec(measures['sgx']['min'])} \\\\ \\hline \n"
    res += f"\\cellcolor{{gray!5}} Max & {fixPrec(measures['direct']['max'])} & {fixPrec(measures['sgx']['max'])} \\\\ \\hline \n"
    res += f"\\cellcolor{{gray!5}} Q2 & {fixPrec(measures['direct']['q2'])} & {fixPrec(measures['sgx']['q2'])} \\\\ \\hline \n"
    # res += f"\\cellcolor{{gray!5}} Samples & {fixPrec(measures['direct']['N'])} & {fixPrec(measures['sgx']['N'])} \\\\ \\hline \n"

    res += "\\end{tabular}\n"
    # res += "\\end{table}\n"

    with open(f"/Users/adnanjamil/projects/exjobb/thesis/tables/results/{node}.tex", "w") as f:
        f.write(res)


# Plotting the data
envs = ['sgx', 'direct']

nodes = list(data.keys())

for node in nodes:
    printResultsTable(node)
    for env in envs:
        n = range(data[node][env]['N'])
        samples = data[node][env]['samples']
        # Sort samples
        samples.sort()

        # Histogram:

        plt.hist(samples,
                 label=getEnv(env),
                 density=True,
                 log=True,
                 stacked=True,
                 histtype="step",
                 color=('#1f77b4' if env == 'direct' else '#ff7f0e')
                 )

    plt.xlabel('Execution time(ms)')
    plt.ylabel('Density')
    plt.title(getNodeName(node))
    plt.legend()

    plt.savefig(
        f'/Users/adnanjamil/projects/exjobb/thesis/figures/results/{node}.png')
    plt.close()
