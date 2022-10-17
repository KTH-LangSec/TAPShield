import fs from "fs";
import nodeplotlib from "nodeplotlib";

function fixPrec(n) {
  return Math.round(n * 100) / 100;
}

const { plot, Plot } = nodeplotlib;

const args = process.argv.slice(2);
const inputFile = args[0];
const firstNode = args[1];
const lastNode = args[2];

const [flow, xx, env, output_unused, size] = inputFile.split("_");

const logs = fs.readFileSync(inputFile, "utf8");

const firstMeasure = [];
const lastMeasure = [];
const nodes = new Set();

const msgGroups = {};

for (const line of logs.split("\n")) {
  // Check if [metric] in line
  if (line.includes("[metric]")) {
    const measure = JSON.parse(line.slice(26));

    const [unused, node, type] = measure.event.split(".");

    let measureData = {
      timestamp: measure.timestamp,
      type,
      node: measure.nodeid,
    };

    // Group all measures by msgid to make sure they are from the same flow instance
    if (measure.msgid in msgGroups) {
      msgGroups[measure.msgid].push(measureData);
    } else {
      msgGroups[measure.msgid] = [measureData];
    }
  }
}

let rttList = [];
const x = [];
// Go through all msgids
for (const msgid in msgGroups) {
  const nodesMetrics = msgGroups[msgid];
  // console.log("nodesMetrics", nodesMetrics);

  const first = nodesMetrics.find(
    (m) => m.node === firstNode && m.type === "send"
  );
  const last = nodesMetrics.find(
    (m) => m.node === lastNode && m.type === "done"
  );

  if (first && last) {
    const rtt = last.timestamp - first.timestamp;
    rttList.push(rtt);
    x.push(msgid);
  }
}

const sizeValue = size ? size.split(".")[0] + "_" : "";
// Save RTT list to json file:
fs.writeFileSync(
  `${flow}_${sizeValue}${env}_rtt_values.json`,
  JSON.stringify(rttList)
);

process.exit(0);

// Compute statistical values:

// Mean:
const mean = rttList.reduce((a, b) => a + b, 0) / rttList.length;

const std = Math.sqrt(
  rttList.reduce((a, b) => a + (b - mean) ** 2, 0) / rttList.length
);

const confidenceInterval = (1.96 * std) / Math.sqrt(rttList.length);

const median = rttList[Math.floor(rttList.length / 2)];
const min = Math.min(...rttList);
const max = Math.max(...rttList);

let output = "";

if (env == "sgx") {
  output += flow + " - " + env;
} else {
  output += flow;
}
output += " & ";

output += `\\SI{${fixPrec(mean)}}{} & `;
output += `\\SI{${fixPrec(std)}}{} & `;
output += `\\SI{${fixPrec(confidenceInterval)}}{} & `;

output += `(\\SI{${fixPrec(min)}}, \\SI{${fixPrec(max)}}){} & `;
output += `\\SI{${fixPrec(median)}}{} \\\\ \\hline`;

console.log(output);
