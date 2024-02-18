import * as esbuild from "esbuild";
import * as fs from "fs/promises";
import * as crypto from "crypto";
import * as path from "path";
import aliasPlugin from "esbuild-plugin-alias";
import replacePlugin from "esbuild-plugin-text-replace";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { initializeUserDir, getRequiredNodes, addSSLKeys } from "./utils.js";
import nullPackage from "./esbuild-plugin-null-package.js";
/**
 * Main script for building the node-red executable.
 * - Configuration is provided from build.config.json in root dir
 * - The node-red executable is built in the build/ directory in root
 * - Execute with `node build.js`
 */

export async function main() {
  const configData = await fs.readFile("build.config.json", "utf8");
  const config = JSON.parse(configData);

  const BUNDLE_ONLY_REQUIRED_NODES = config.bundleOnlyRequiredNodes;

  const WRAPPER = path.resolve("src", "wrapper.js");

  const DISTDIR = path.resolve(config.outputDir);

  const USERDIR = path.join(DISTDIR, "user-dir");

  await initializeUserDir(USERDIR);

  await addSSLKeys(USERDIR, config);

  const {
    requiredNodes,
    configNodesRaw,
    origNodeLoader
  } = await getRequiredNodes(USERDIR, config);

  await esbuild.build({
    entryPoints: [WRAPPER],
    bundle: true,
    minify: config.minify,
    sourcemap: config.sourcemap,
    platform: "node",
    target: "node20",
    outfile: path.join(DISTDIR, "index.js"),
    plugins: [
      nullPackage([
        // remove not needed modules by returning empty modules
        "@node-red/editor-api",
        "@node-red/editor-client",
         // TODO 
        // "node-red-admin",
        "oauth2orize"
      ]),
      replacePlugin({
        include: /@node-red\/registry\/lib\/loader\.js$/,
        pattern: [
          // direcly load required nodes
          // node_modules/@node-red/registry/lib/loader.js:42
          [
            /var modules = localfilesystem\.getNodeFiles\(disableNodePathScan\);\s*return loadModuleFiles\(modules\)/g,
            `return loadModuleFiles(${BUNDLE_ONLY_REQUIRED_NODES
              ? JSON.stringify(requiredNodes)
              : configNodesRaw})`
          ],
          // replace dynamic load with static table which allows esbuild to inline the code
          // node_modules/@node-red/registry/lib/loader.js:361
          ["var r = require(node.file);", origNodeLoader],
          // remove check which will check if node exists in filesystem when node module name != "node-red"
          // node_modules/@node-red/registry/lib/loader.js:54
          ['module.name != "node-red" && first', "false"]
        ]
      }),
      replacePlugin({
        include: /@node-red\/runtime\/lib\/index\.js$/,
        pattern: [
          // do not fail if there is no package in parent folder
          // node_modules/@node-red/runtime/lib/index.js:103
          [
            'version = require(path.join(__dirname,"..","package.json")).version;',
            'try { version = require(path.join(__dirname,"..","package.json")).version; } catch(err){version="1.0.0"}'
          ],
          // temp fixes - has been merged upstream in node-red repository
          ["const installRetry", "let installRetry"]
        ]
      }),
      replacePlugin({
        include: /node-red\/lib\/red\.js$/,
        pattern: [
          // direcly load required nodes
          // node_modules/@node-red/registry/lib/loader.js:42
          [
            'userSettings.coreNodesDir = path.dirname(require.resolve("@node-red/nodes"))',
            `userSettings.coreNodesDir = '${USERDIR}'`
          ]
        ]
      })
    ]
  });
}

(async () => {
  await main();
  console.log("done");
})();
