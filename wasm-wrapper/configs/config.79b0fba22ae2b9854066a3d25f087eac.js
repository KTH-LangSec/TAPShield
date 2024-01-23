import commonjs from '@rollup/plugin-commonjs';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import json from "@rollup/plugin-json";
import builtins from 'rollup-plugin-node-builtins';
import customResolver, {pathResolve} from './resolve.79b0fba22ae2b9854066a3d25f087eac.js';
import resolve, { nodeResolve } from '@rollup/plugin-node-resolve';
import polyfillNode from 'rollup-plugin-polyfill-node'
import inject from "@rollup/plugin-inject";
// import typescript from '@rollup/plugin-typescript';
import alias from '@rollup/plugin-alias';
// import JavyBuiltin from "../plugins/javy-fs.js";
import * as path from "path";
import * as fs from 'fs';

// Iterate up until the folder contains the .config.nodes.json file
function getroot(curr){
  // check if the file exists in this folder
  const f = path.resolve(curr, "PROBE");
  // check if the file exists in this folder
  const exist = fs.existsSync(f);
  if(exist){
    return curr;
  } else {
    return getroot(path.resolve(`${curr}/..`));
  }

}

let PWD = getroot(path.resolve("./"));
PWD = path.resolve(PWD, "node_modules");

// open file and write 
fs.writeFileSync(`testted.txt`, PWD);

export default {
  //input: '70-WJSON.logic.js', // your main entry point
  output: {
    // exports: 'named',
    format: 'es',  // output format compatible with Javy,
    plugins: [
      // solve()
    ]
  },
  plugins: [
    alias({
      entries: [  
        { find: 'node_modules', replacement: `${PWD}` },
      ]
    }),
    // pathResolve(),
    customResolver(),
    nodeResolve({
      browser: true,
      mainFields: ['browser', 'module'],
    }),
     polyfillNode(),
    // so Rollup can convert `node_modules` to an ES module,
		// ,
    builtins(),    
    nodePolyfills(),

    commonjs({  
      ignoreGlobal: true, 
      requireReturnsDefault: 'auto'
    }),
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
