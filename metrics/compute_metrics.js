import fs from "fs";
import nodeplotlib from "nodeplotlib";

const { plot, Plot } = nodeplotlib;

function cap(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function fixPrec(n) {
  return Math.round(n * 100) / 100;
}

function range(n) {
  return Array.from(Array(n).keys());
}

function getNodeName(node, size, flow) {
  if (size && size == "large.txt") {
    return node + " (large)";
  }
  if (node == "file") {
    return node + " - " + flow;
  }

  return node;
}

const excludedNodes = [
  "debug",
  "debug (large)",
  "status",
  "status (large)",
  "change",
  "inject",
  "inject (large)",
];

var files = fs.readdirSync(".");

const outputFiles = files.filter((f) => f.includes("output"));

let results = {};

const measurements = {}; // A list of all measurements across all flows

for (const file of outputFiles) {
  let [flow, metrics_unused, environment, output, size] = file.split("_");

  // flows.add(flow);

  // results[environment][flow] = {};

  const logs = fs.readFileSync(file, "utf8");

  for (const line of logs.split("\n")) {
    // Check if [metric] in line
    if (line.includes("[metric]")) {
      const measure = JSON.parse(line.slice(26));
      // console.log(measure)
      const [unused, node, type] = measure.event.split(".");

      if (node == "memory") {
        continue;
      } else {
        const nodeName = getNodeName(node, size, flow);

        if (!measurements[nodeName]) {
          measurements[nodeName] = {
            sgx: [],
            direct: [],
          };
        }

        measurements[nodeName][environment].push({
          timestamp: measure.timestamp,
          value: measure.value,
          type,
          node: nodeName,
        });
      }
    }
  }
}
// For each unique node, we want to compute the time between type "receive" and "done"

for (const nodeKey of Object.keys(measurements)) {
  for (const environment of Object.keys(measurements[nodeKey])) {
    const finalEvent = nodeKey == "cocossd" ? "send" : "done";

    let nodeMeasurements = measurements[nodeKey][environment].filter(
      (m) => m.type === "receive" || m.type === finalEvent
    ); // take only measurements of type "receive" and "done"

    // sort nodeMeasurements by timestamp ascending
    nodeMeasurements.sort((a, b) => a.timestamp - b.timestamp);

    let samples = [];

    for (let i = 0; i < nodeMeasurements.length - 1; i++) {
      const m1 = nodeMeasurements[i];
      const m2 = nodeMeasurements[i + 1];

      if (m1.type === "receive" && m2.type === finalEvent) {
        samples.push(m2.timestamp - m1.timestamp);
      }
    }

    const N = samples.length;

    if (N == 0) {
      console.warn(`No samples for ${nodeKey}`);
    }

    // Calculate the mean and standard deviation of the samples
    const mean = samples.reduce((s, x) => s + x, 0) / N;
    const std = Math.sqrt(samples.reduce((s, x) => s + (x - mean) ** 2, 0) / N);

    // Calculate the 95% confidence interval
    const confidenceInterval = (1.96 * std) / Math.sqrt(N);

    // Calculate margin of error in percentage
    const marginOfError = confidenceInterval / mean;

    // Calculate each quartile of the samples
    const samplesSorted = [...samples].sort((a, b) => a - b);

    const q1 = samplesSorted[Math.floor(N / 4)];
    const q2 = samplesSorted[Math.floor(N / 2)];
    const q3 = samplesSorted[Math.floor((3 * N) / 4)];

    // Get max/min of the samples
    const max = Math.max(...samples);
    const min = Math.min(...samples);

    if (N > 0) {
      if (!results[nodeKey]) {
        results[nodeKey] = {
          sgx: {},
          direct: {},
        };
      }

      // Add results to the results object
      results[nodeKey][environment] = {
        N,
        mean,
        std,
        confidenceInterval,
        marginOfError,
        q1,
        q2,
        q3,
        max,
        min,
        samples,
      };
    }
  }
}

// Export the results to a json file
fs.writeFileSync("results.json", JSON.stringify(results, null, 2));

// process.exit(0);

// Printing results ============================================================

function printResults() {
  // Sort nodes keys by name in results

  results = Object.keys(results)
    .sort((a, b) => (a > b ? 1 : -1))
    .reduce(function (acc, key) {
      acc[key] = results[key];
      return acc;
    }, {});

  // Create a file with table for latex, one row per node and each environment

  for (const nodeKey of Object.keys(results)) {
    let tableLatex = "";

    // Print table header:
    tableLatex += "\\begin{tabular}{|p{.3\\textwidth}|";

    for (let i = 0; i < 7; i++) {
      tableLatex += "c|";
    }

    // Print table headings for each column
    tableLatex += "}\n";

    tableLatex += "\\hline\n";
    tableLatex += "\\textbf{Node} & ";
    // tableLatex += "\\textbf{\\textit{n}} & ";
    tableLatex += "$\\pmb{\\mu}$ & ";
    tableLatex += "$\\pmb{\\sigma}$ & ";
    tableLatex += "$\\pmb{C_I}$ &";
    tableLatex += "\\textbf{(min, max)} & ";
    // tableLatex += "$\\pmb{Q_1}$ & ";
    tableLatex += "\\textbf{median} &";
    tableLatex += "$\\pmb{n}$";
    tableLatex += "\\\\ \\hline \\hline \n"; // margin of error

    if (excludedNodes.includes(nodeKey)) {
      continue;
    }

    for (const environment of Object.keys(results[nodeKey]).reverse()) {
      // tableLatex += `${nodeKey} - ${environment} & `;
      if (environment == "sgx") {
        tableLatex += `${nodeKey} - ${environment} & `;
      } else {
        tableLatex += `${nodeKey} & `;
      }

      // tableLatex += `${results[nodeKey][environment].N.toFixed(2)} & `;
      tableLatex += `${fixPrec(results[nodeKey][environment].mean)} & `;
      tableLatex += `${fixPrec(results[nodeKey][environment].std)} & `;
      tableLatex += `${fixPrec(
        results[nodeKey][environment].confidenceInterval
      )} &`;

      tableLatex += `(${fixPrec(results[nodeKey][environment].min)},`;
      tableLatex += `${fixPrec(results[nodeKey][environment].max)}) & `;
      // tableLatex += `${fixPrec(results[nodeKey][environment].q1)} & `;
      tableLatex += `${fixPrec(results[nodeKey][environment].q2)} &`;
      tableLatex += `${fixPrec(results[nodeKey][environment].N)} `;

      tableLatex += "\\\\ \\hline \n";
    }
    // Add another hline
    tableLatex += "\\hline\n";

    tableLatex += "\\end{tabular}\n";

    // print table to file
    fs.writeFileSync(
      `/Users/adnanjamil/projects/exjobb/thesis/tables/results${nodeKey}.tex`,
      tableLatex
    );
  }
}
