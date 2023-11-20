'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var resolve = require('@rollup/plugin-node-resolve');
var commonjs = require('@rollup/plugin-commonjs');
var json = require('@rollup/plugin-json');
var nodeGlobals = require('rollup-plugin-node-globals');
var builtins = require('rollup-plugin-node-builtins');

const BLOCKLIST = [
    ['fs', `${__dirname}/../javy_js/fs.js`],
    ['https', `${__dirname}/../javy_js/https.js`],
    ['os', `${__dirname}/../javy_js/os.js`],
    ['process', `${__dirname}/../javy_js/process.js`],
    ['wasi', `${__dirname}/../javy_js/wasi.js`],
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
        return null; // other ids should be handled as usually
      },
      load(id) {
        // console.log(id);
        return null; // other ids should be handled as usually
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
  },
  plugins: [
    customResolver(),
    builtins(),
    nodeGlobals(), // Solve process access
    json(), // To load json
    commonjs(), // so Rollup can convert `node_modules` to an ES module,
    resolve({
      browser: true,
      preferBuiltins: false,

    }), // so Rollup can find `node_modules`
  ],
};

exports.default = rollup_config;
