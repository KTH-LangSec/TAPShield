'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var commonjs = require('@rollup/plugin-commonjs');
var json = require('@rollup/plugin-json');
var builtins = require('rollup-plugin-node-builtins');
require('console');
var pluginNodeResolve = require('@rollup/plugin-node-resolve');
var polyfillNode = require('rollup-plugin-polyfill-node');
var inject = require('@rollup/plugin-inject');

const fs = require('fs');

const BLOCKLIST = [
    ['fs', `${__dirname}/../javy_js/fs.js`],
    ['https', `${__dirname}/../javy_js/https.js`],
    ['os', `${__dirname}/../javy_js/os.js`],
    ['process', `${__dirname}/../javy_js/process.js`],
    ['wasi', `${__dirname}/../javy_js/wasi.js`],
    ['fs-extra', `${__dirname}/../javy_js/fs.js`],
    ['path', `${__dirname}/../javy_js/path.js`],
    ['iconv-lite', `${__dirname}/../javy_js/iconv-lite.js`],


    // Node-RED
    ['red_util', `${__dirname}/../../util/lib/util.js`],
    ['red_log', `${__dirname}/../../util/lib/log.js`],
];

// rollup-plugin-my-example.js
function customResolver () {
    return {
      name: 'custom-resolver', // this name will show up in logs and errors
      resolveId ( source ) {
        // console.log(source);
        // Check if the source is in the blocklist
        for (let i = 0; i < BLOCKLIST.length; i++) {
            if (BLOCKLIST[i][0] === source) {
                console.log("Blocking ", source);
                return BLOCKLIST[i][1];
            }
        }
        // return null; // other ids should be handled as usually
      }
    };
  }

// Our plugins
// import JavyBuiltin from "../plugins/javy-fs.js";

var rollup_config = {
  //input: '70-WJSON.logic.js', // your main entry point
  output: {
    // exports: 'named',
    format: 'cjs',  // output format compatible with Javy,
    plugins: [
      // solve()
    ]
  },
  plugins: [
    customResolver(),
    pluginNodeResolve.nodeResolve({
      browser: true,
      mainFields: ['browser', 'module'],
    }),
    polyfillNode(),
    // so Rollup can convert `node_modules` to an ES module,
		// ,
    builtins(),
    commonjs({ include: [/node_modules/,  ".csj", ".js", ".mjs"], transformMixedEsModules: true, ignoreGlobal: true, requireReturnsDefault: 'auto' }), 
    ,
    json(), // To load json
    inject({
			modules: {
				// BigInt: require.resolve("big-integer"),
				// process: "process-es6",
				Buffer: ['buffer', 'Buffer']
			},
		}),
  ],
};

exports.default = rollup_config;
