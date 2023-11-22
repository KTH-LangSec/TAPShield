import mustache from 'mustache';
// path = require('node:path'); 
import crypto from 'crypto';

import * as fs from "fs";
import * as path from "path";
import * as child_process from "child_process";

let GLOBAL_CACHE = {}
let INSTANCE_CACHE = {}
const __dirname = fs.realpathSync('./wasm-wrapper');

const DEBUG = 1;

function get_package_json_folder(f, ops) {

    // Start by this file and go to parent until package.json is found
    // make this a function
    let current = f;
    // This is a patch !
    if(ops.full_node){
        return current;
    }

    let found = false;
    while(!found) {
        let files = fs.readdirSync(current);
        if(files.includes("package.json")) {
            found = true;
        } else {
            current = current.split("/").slice(0, -1).join("/");
        }
    }
    return current;
}


function _(c, els = undefined) {
    try{
        return c()
    } catch(e) {
        console.log(e)

        if(els) {
            return _(els);
        }
    }
}

export default function wasmwrap_code(node, ops = {}, api_permissions = {}, package_permissions = {}, file_permissions = {}){

    if(ops.do_nothig){
        console.log("Doing nothing");
        return 'return msg'
    }
    // Hash the node to avoid collisions
    let filedir;
    console.log("[WASM-RED] node", node.file);

    if(ops && ops.cwd) {
        filedir = get_package_json_folder(ops.cwd, ops)
    }else {
        filedir = get_package_json_folder(thisdir, ops);
        filedir = `${filedir}/tmp_nodes`
    }

    

    var md5sum = crypto.createHash('md5');
    md5sum.update(node);
    let node_hash = md5sum.digest('hex');
    // Creates a temporary file name
    let tmp = `wasm-red.${node_hash}`;
    let tmpname = tmp;
    let listenername = node_hash;
            
    // tmp = `/tmp/${tmp}`;
    // For dev, comment out for deploy
    tmp = `${filedir}/${tmp}`;

    if(DEBUG) console.log("[WASM-RED] Hashing node: ", node_hash);
    if(false && node_hash in GLOBAL_CACHE && !ops.non_cache) { 
        if(DEBUG) console.log("[WASM-RED] Node already in cache");
        // Load the written code
        return GLOBAL_CACHE[node_hash];
    }
    // Check in the files system for the compilation result
    if(fs.existsSync(`${tmp}.wasm`) && !ops.non_cache) {
        // Load the written code
    }

    let wasm_wasi = `${__dirname}/templates/wasm-wasi-dyn.js`;

    if(ops.function_body) {
        throw "Not implemented"
    }

    if(DEBUG){
        //    console.log(`[WASM-RED] wrapping \n===================\n'${node}'\n========================` )
    }
    let template_path = `${__dirname}/templates/wrapper.js`;
    let resolve_template_path = `${__dirname}/templates/custom-resolver-template.js`;
    let config_template_path = `${__dirname}/templates/rollup.config.template.js`;
    let permissions_template_path = `${__dirname}/templates/permissions.template.yml`;

    let nodecontent = node;
    if(ops.full_node){
        template_path = `${__dirname}/templates/wrapper-fullnode.js`;
        wasm_wasi = `${__dirname}/templates/wasm-wasi-node.js`;
        let filename = path.basename(ops.file);
        nodecontent = `import * as nodemod from './${filename}'`;
        // nodecontent = `const nodemod = require('./${filename}')`;
    }
    // Render
    let rendered = mustache.render(fs.readFileSync(template_path, 'utf-8'), {
        inner_code: ops.full_node? nodecontent : `function _${listenername}(){\n${nodecontent}\n}`,
        mm: `_${listenername}`,
    });


    let thisdir = __dirname;
    let execS = child_process.execSync;

    // Download the right version of javy first
    let _f = execS(`bash ${thisdir}/download-javy.sh`, {
        cwd: `${thisdir}/`
    });
    console.log("[WASM-RED] Downloaded javy", _f.toString());

    // write to tmp file
    fs.writeFileSync(`${tmp}.js`, rendered);

    // Call rollup
    // Render config first based in the node manifest

    let rendered_resolver= mustache.render(fs.readFileSync(resolve_template_path, 'utf-8'), {
        ...package_permissions
    });

    fs.writeFileSync(`${thisdir}/configs/resolve.${node_hash}.js`, rendered_resolver);
    console.log("[WASM-RED resolver written to", `resolver.${node_hash}.js`);


    let rendered_config = mustache.render(fs.readFileSync(config_template_path, 'utf-8'), {
        RESOLVER: `resolve.${node_hash}.js`
    });
    fs.writeFileSync(`${thisdir}/configs/config.${node_hash}.js`, rendered_config);

    let rollup = `rollup  ${tmp}.js --config ${thisdir}/configs/config.${node_hash}.js --bundleConfigAsCjs --file ${tmpname}.bundle.inner.js`
    //let rollup = `esbuild  ${tmp}.js --bundle --platform=node --outfile=${tmp}.bundle.inner.js`
    
    if(DEBUG) console.log("[WASM-RED] Calling rollup: ", rollup);
    

    if(DEBUG){
        console.log("[WASM-RED] filedir", filedir);
    }
    _(() => execS(rollup, {
        // Set the CWD on the folder of the original file
        cwd: `${filedir}/`
    }));
    // Patch the generated file
    let content = fs.readFileSync(`${tmp}.bundle.inner.js`, 'utf-8');
    let replace= content;
    
    fs.writeFileSync(`${tmp}.bundle.inner.js`, replace);

    // Create permissions YAML file
    let rendered_permissions= mustache.render(fs.readFileSync(permissions_template_path, 'utf-8'), {
        read_whites: file_permissions.READ.WHITELIST.map(i => ({"name": i})),
        read_blacks: file_permissions.READ.BLACKLIST.map(i => ({"name": i})),
        write_whites: file_permissions.WRITE.WHITELIST.map(i => ({"name": i})),
        write_blacks: file_permissions.WRITE.BLACKLIST.map(i => ({"name": i})),
    });
    fs.writeFileSync(`${tmp}.permissions.yml`, rendered_permissions);
    
    // Call javy by default
    console.log("[WASM-RED] calling Javy");

    let cmd = `${thisdir}/bin/javy compile --file-permissions ${tmp}.permissions.yml --http-permissions ${thisdir}/templates/permissions-http.yaml --wit ${thisdir}/templates/export.wit -n "node-red" ${tmp}.bundle.inner.js -o ${tmp}.wasm`;
    
    if(DEBUG){
        console.log("[WASM-RED] Compiling Wasm file", `${tmp}.bundle.inner.js`);
    }
    let sync = true;
    let rrt = execS(cmd);
    let name = `${tmp}.wasm`;

    // hash the node code

    // let wasmbytes = fs.readFileSync(name);
    // Compile the Wasm module
    /*let wasm = new WebAssembly.Module(
        fs.readFileSync(name),
    );*/

    if(DEBUG){
        console.log(`[WASM-RED] Compiled wasm to cache ${name}`);
    }
    GLOBAL_CACHE[node_hash] = [null, `${tmp}.wrapper.js`];

    // The result if the STACK
    INSTANCE_CACHE[node_hash] = {
        RESULT:[],
        INSTANCE: null
    }

    // Initialize
    console.log("[WASM-RED] rendering", wasm_wasi);

    let rendered_wasm = mustache.render(fs.readFileSync(wasm_wasi, 'utf-8'), {
        wasmfile: node_hash,
        debug: 1,
        time: ops.time,
        ROOT: file_permissions.ROOT,
        // Here the compiling time permissions, 
        // If they are not set, the wrapper functions wont be generated
        ...api_permissions,
    })

    // This is jsut for debug, remove after
    fs.writeFileSync(`${tmp}.wrapper.js`, rendered_wasm);
    return [rendered_wasm, `${tmp}.wrapper.js`, `${tmp}.wasm`, `${tmp}.permissions.yml`]
    // Render the code template
    // Return the call to the fresh Wasm code
}