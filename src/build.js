import * as esbuild from "esbuild";
import * as fs from "fs/promises";
import * as crypto from "crypto";
import * as path from "path";
import aliasPlugin from "esbuild-plugin-alias";
import replacePlugin from "esbuild-plugin-text-replace";
import * as WASI from "wasi";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { initializeUserDir, getRequiredNodes, addSSLKeys } from "./utils.js";
import nullPackage from "./esbuild-plugin-null-package.js";
import { polyfillNode } from "esbuild-plugin-polyfill-node";
/**
 * Main script for building the node-red executable.
 * - Configuration is provided from build.config.json in root dir
 * - The node-red executable is built in the build/ directory in root
 * - Execute with `node build.js`
 */

// Define the custom resolver plugin
const customResolverPlugin = {
    name: 'custom-node-red-resolver',
    setup(build) {
        build.onResolve({ filter: /^node-red$/ }, args => {
            // Replace 'custom-module' with the actual path or URL
            return { path: '/home/rof13thfloor/work/Node-red-SGX/node_modules/node-red/red.js' };
        });
    },
};


export async function main() {
  const configData = await fs.readFile("build.config.json", "utf8");
  const config = JSON.parse(configData);

  const BUNDLE_ONLY_REQUIRED_NODES = config.bundleOnlyRequiredNodes;

  const WRAPPER = path.resolve("src", "wrapper.js");

  const DISTDIR = path.resolve(config.outputDir);

  const USERDIR = path.join(DISTDIR, "user-dir");

  // Here we load the Wasm manifest
  const WASM_MANIFEST_CONTENT = await fs.readFile(config.wasmManifestPath, "utf-8");
  const WASM_MANIFEST = JSON.parse(WASM_MANIFEST_CONTENT);

  await initializeUserDir(USERDIR);

  await addSSLKeys(USERDIR, config);


  let {
    requiredNodes,
    configNodesRaw,
    origNodeLoader
    // The major change is here, we modify the loaders to use the Wasm files
  } = await getRequiredNodes(USERDIR, config, WASM_MANIFEST);

  console.log("requiredNodes", requiredNodes, origNodeLoader);
  await esbuild.build({
    entryPoints: [WRAPPER],
    bundle: true,
    minify: config.minify,
    sourcemap: config.sourcemap,
    platform: "node",
    target: "es2020",
    outfile: path.join(DISTDIR, "index.js"),
    plugins: [
      //customResolverPlugin,
      nullPackage([
        // remove not needed modules by returning empty modules
        "@node-red/editor-api",
        "@node-red/editor-client",
        "@mapbox/mock-aws-s3",
        "mock-aws-s3",
        "aws-sdk",
        "nock",
        "node:path",
        //"wasi",

        /*"fs",
        "path",
        "net",
        "util",
        "events",
        "os",
        "stream",
        "string_decoder",
        "zlib",
        "buffer",
        "assert",
        "crypto",*/
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
