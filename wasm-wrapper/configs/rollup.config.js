import commonjs from '@rollup/plugin-commonjs';
import json from "@rollup/plugin-json";
import builtins from 'rollup-plugin-node-builtins';
import customResolver, {pathResolve} from './custom-resolver.js';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import polyfillNode from 'rollup-plugin-polyfill-node'
import inject from "@rollup/plugin-inject";
// import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
// Our plugins
// import JavyBuiltin from "../plugins/javy-fs.js";

export default {
  //input: '70-WJSON.logic.js', // your main entry point
  output: {
    // exports: 'named',
    format: 'es20',  // output format compatible with Javy,
    plugins: [
      // solve()
    ]
  },
  plugins: [
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
    commonjs({  ignoreGlobal: true, requireReturnsDefault: 'auto' }), 
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