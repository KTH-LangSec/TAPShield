import RED from "node-red";
import express from "express";
import https from "https";
import fs from "fs";
import ws from "ws";

const certFileName = "server.cert";
const keyFileName = "server.key";
const caFile = "ca.pem";

// Settings configuration for node-red
let settings = {
  disableEditor: true, // Disable the editor
  httpAdminRoot: false, // Disable the http admin server
  httpNodeRoot: "/api", // All http nodes will be served from this root
  functionGlobalContext: {},
  credentialSecret: process.env.NODE_RED_SECRET || "SKEY",
  https: {
    ca: `./user-dir/${caFile}`,
    cert: `./user-dir/${certFileName}`,
    key: `./user-dir/${keyFileName}`,
  },
  requireHttps: true,
  userDir: "./user-dir/",
  coreNodesDir: "./",
  flowFile: "flow.json",
  logging: {
    // Only console logging is currently supported
    console: {
      // Level of logging to be recorded. Options are:
      // fatal - only those errors which make the application unusable should be recorded
      // error - record errors which are deemed fatal for a particular request + fatal errors
      // warn - record problems which are non fatal + errors + fatal errors
      // info - record information about the general running of the application + warn + error + fatal errors
      // debug - record information which is more verbose than info + info + warn + error + fatal errors
      // trace - record very detailed logging + debug + info + warn + error + fatal errors
      // off - turn off all logging (doesn't affect metrics or audit)
      level: "trace",
      // Whether or not to include metric events in the log output
      metrics: true,
      // Whether or not to include audit events in the log output
      audit: true,
    },
  },
  externalModules: {
    autoInstall: false,
    autoInstallRetry: 30,
    palette: {
      allowInstall: false,
      allowUpload: false,
      allowList: [],
      denyList: [],
    },
    modules: {
      allowInstall: false,
      allowList: [],
      denyList: [],
    },
  },
  projects: {
    enabled: false,
  },
};

let init = async () => {
  const app = express();

  // Add a simple route for static content served from 'public'
  app.use("/public", express.static("public"));

  // Create a server
  const server = https.createServer(
    {
      ca: fs.readFileSync(`user-dir/${caFile}`),
      key: fs.readFileSync(`user-dir/${keyFileName}`),
      cert: fs.readFileSync(`user-dir/${certFileName}`),
    },
    app
  );

  RED.init(server, settings);

  // Serve the http nodes from /api
  app.use(settings.httpNodeRoot, RED.httpNode);

  // // Serve the editor UI from /red
  return new Promise((resolve, reject) => {
    // Start our own custom server instead on using the default one by node-red
    server.listen(8443, function () {
      console.log("Server listening on ", 8443);

      RED.start().then(function () {
        console.log("Node-Red started");
      });
    });

    resolve();
  });
};

export async function main() {
  await init(); // Init and start RED

  process.on("uncaughtException", function (err) {
    console.log("[red] Uncaught Exception:");
    if (err.stack) {
      try {
        RED.log.error(err.stack);
      } catch (err2) {
        console.log(err.stack);
      }
    } else {
      try {
        RED.log.error(err);
      } catch (err2) {
        console.log(err);
      }
    }
    process.exit(1);
  });

  process.on("message", function (msg) {
    console.log(msg);
  });
}

(async function () {
  await main();
})();
