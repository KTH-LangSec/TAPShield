import json
import matplotlib.pyplot as plt
import numpy as np


# List of flow names:
flows = ["exec", "files_large", "files_small",
         "mqtt", "object", "udp", "weather"]

allSGXmeans = []
allDirectMeans = []

# Opening JSON file
for flow in flows:
    sgxData = None
    directData = None

    with open(f'{flow}_sgx_rtt_values.json') as json_file:
        sgxData = json.load(json_file)

    with open(f'{flow}_direct_rtt_values.json') as json_file:
        directData = json.load(json_file)

    def fixPrec(unit, num):
        res = num

        if unit == "s":
            res = num / 1000

        res = "{:.2f}".format(res)
        return f"\\SI{{{res}}}{{}}"

    def printResultsTable(sgxData, directData):

        directMean = np.mean(directData)
        sgxMean = np.mean(sgxData)

        allSGXmeans.append(sgxMean)
        allDirectMeans.append(directMean)

        directStd = np.std(directData)
        sgxStd = np.std(sgxData)
        directMin = np.min(directData)
        sgxMin = np.min(sgxData)
        directMax = np.max(directData)
        sgxMax = np.max(sgxData)
        directMedian = np.median(directData)
        sgxMedian = np.median(sgxData)

        directConfidence = (1.96 * directStd) / np.sqrt(len(directData))
        sgxConfidence = (1.96 * sgxStd) / np.sqrt(len(sgxData))

        # Create Latex table for the results
        res = ""

        unit = "ms"

        # if directMean > 1000:
        #     unit = "s"

        # res += "\\begin{table}[htb]\n"
        # res += "\\centering\n"
        # res += f"\\caption{{Performance evaluation - {getNodeName(node)}}}\n"
        # res += f"\\label{{tab:results-{node}}}\n"
        res += "\\def\\arraystretch{1.5}\n"
        res += "\\begin{tabular}{|l|l|l|}\n"
        res += "\\hline\n"
        res += "\\textbf{Metric} & \\textbf{Linux (" + unit + \
            ")} & \\textbf{SGX ({" + unit + "})} \\\\ \\hline \\hline  \n"
        # Print median
        res += f"\\cellcolor{{gray!5}} $\mu$ & {fixPrec(unit, directMean)} & {fixPrec(unit, sgxMean)} \\\\ \\hline \n"
        # Print standard deviation
        res += f"\\cellcolor{{gray!5}} $\sigma$ & {fixPrec(unit, directStd)} & {fixPrec(unit, sgxStd)} \\\\ \\hline \n"
        # Print confidence interval
        res += f"\\cellcolor{{gray!5}} $C_I$ & {fixPrec(unit, directConfidence)} & {fixPrec(unit, sgxConfidence)} \\\\ \\hline \n"
        # Print min and max
        res += f"\\cellcolor{{gray!5}} Min & {fixPrec(unit, directMin)} & {fixPrec(unit, sgxMin)} \\\\ \\hline \n"
        res += f"\\cellcolor{{gray!5}} Max & {fixPrec(unit, directMax)} & {fixPrec(unit, sgxMax)} \\\\ \\hline \n"
        res += f"\\cellcolor{{gray!5}} Q2 & {fixPrec(unit, directMedian)} & {fixPrec(unit, sgxMedian)} \\\\ \\hline \n"
        # res += f"\\cellcolor{{gray!5}} Samples & {fixPrec(measures['direct']['N'])} & {fixPrec(measures['sgx']['N'])} \\\\ \\hline \n"

        res += "\\end{tabular}\n"
        # res += "\\end{table}\n"

        with open(f"/Users/adnanjamil/projects/exjobb/thesis/tables/results/{flow}_rtt.tex", "w") as f:
            f.write(res)

    # Histogram:
    sgxData.sort()
    directData.sort()

    printResultsTable(sgxData, directData)

    plt.hist(sgxData,
             label="SGX",
             density=True,
             log=True,
             stacked=True,
             histtype="step",
             color=('#ff7f0e')
             )
    plt.hist(directData,
             label="Linux",
             density=True,
             log=True,
             stacked=True,
             histtype="step",
             color=('#1f77b4')
             )

    plt.xlabel('Round Trip Time (ms)')
    plt.ylabel('Density')
    # plt.title(flow.replace("_small", "- Case A",
    #   1).replace("_large", "- Case B", 1))
    plt.legend()

    plt.savefig(
        f'/Users/adnanjamil/projects/exjobb/thesis/figures/results/{flow}_rtt.png')
    plt.close()

# Calculate average mean for SGX and Direct
sgxMean = np.mean(allSGXmeans)
directMean = np.mean(allDirectMeans)

print(f"SGX mean: {sgxMean}")
print(f"Direct mean: {directMean}")
