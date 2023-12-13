import commonjs from '@rollup/plugin-commonjs';
import json from "@rollup/plugin-json";
import builtins from 'rollup-plugin-node-builtins';
import customResolver, {pathResolve} from './resolve.1d6f65d16583fbc4b0b076cbc19c741b.js';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import polyfillNode from 'rollup-plugin-polyfill-node'
import inject from "@rollup/plugin-inject";
// import typescript from '@rollup/plugin-typescript';
import alias from '@rollup/plugin-alias';
// import JavyBuiltin from "../plugins/javy-fs.js";

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
        { find: 'node_modules', replacement: '/home/rof13thfloor/work/Node-red-SGX/node_modules' },
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