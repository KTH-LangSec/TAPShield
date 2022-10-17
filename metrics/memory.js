import fs from "fs";

var files = fs.readdirSync(".");

const outputFiles = files.filter((f) => f.includes("output"));

const results = {};

const flows = new Set();

function fixPrec(n) {
  return Math.round(n / 1000000);
}

const types = new Set();

for (const file of outputFiles) {
  let [flow, metrics_unused, environment, output, size] = file.split("_");

  if (size) {
    flow = `${flow} - ${size}`;
  }

  flows.add(flow);

  if (!results[flow]) {
    results[flow] = {
      sgx: {},
      direct: {},
    };
  }

  const logs = fs.readFileSync(file, "utf8");

  // Get data from: exec_metrics_direct_output.txt

  const measures = [];

  for (const line of logs.split("\n")) {
    // Check if [metric] in line
    if (line.includes("[metric]")) {
      const measure = JSON.parse(line.slice(26));

      const [unused, node, type] = measure.event.split(".");

      if (node == "memory" && type == "rss") {
        types.add(type);
        measures.push({
          timestamp: measure.timestamp,
          value: measure.value,
          type,
          node,
        });
      }
    }
  }

  // For each type of memory measures (rss, heapTotal, heapUsed), add the value to the corresponding sum and count

  for (const type of types) {
    // Get all the measures of the same type
    const measuresOfType = measures.filter((measure) => measure.type == type);
    // Sum all the measurements
    let rss = [];
    for (const measure of measuresOfType) {
      rss.push(measure.value);
    }

    // Mean:
    const mean = rss.reduce((a, b) => a + b, 0) / rss.length;

    const std = Math.sqrt(
      rss.reduce((a, b) => a + (b - mean) ** 2, 0) / rss.length
    );

    const confidenceInterval = (1.96 * std) / Math.sqrt(rss.length);

    const median = rss[Math.floor(rss.length / 2)];
    const min = Math.min(...rss);
    const max = Math.max(...rss);

    // set stats
    results[flow][environment] = {
      mean,
      std,
      confidenceInterval,
      median,
      min,
      max,
    };
  }
}

console.log(`\\begin{table}
\\caption{RSS across flows}
\\label{tab:mem_results}
\\centering
\\begin{tabular}{|l|c|c|c|c|c|}
\\hline
\\textbf{Flow} & $\\pmb{\\mu}$ & $\\pmb{\\sigma}$ & $\\pmb{C_I}$ &\\textbf{(min, max)} & \\textbf{median}\\\\ \\hline \\hline `);

for (const flow of flows) {
  console.log(
    `${flow} & \\SI{${fixPrec(
      results[flow]["direct"].mean
    )}}{} & \\SI{${fixPrec(results[flow]["direct"].std)}}{} & \\SI{${fixPrec(
      results[flow]["direct"].confidenceInterval
    )}}{} & (\\SI{${fixPrec(results[flow]["direct"].min)}}{}, \\SI{${fixPrec(
      results[flow]["direct"].max
    )}}{}) & \\SI{${fixPrec(results[flow]["direct"].median)}}{}  \\\\ \\hline`
  );

  console.log(
    `\\rowcolor{gray!10}${flow} - SGX & \\SI{${fixPrec(
      results[flow].sgx.mean
    )}}{} & \\SI{${fixPrec(results[flow].sgx.std)}}{} & \\SI{${fixPrec(
      results[flow].sgx.confidenceInterval
    )}}{} & (\\SI{${fixPrec(results[flow].sgx.min)}}{}, \\SI{${fixPrec(
      results[flow].sgx.max
    )}}{}) & \\SI{${fixPrec(results[flow].sgx.median)}}{} \\\\ \\hline \\hline`
  );
}

console.log(`\\end{tabular}
\\end{table}`);
