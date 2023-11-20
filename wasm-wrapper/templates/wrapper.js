// Use rollup to inject here all the dependencies

// Load Node utils here
// const utils = require("../../");

// this.process = require("wasm-red-process");
// commonjsGlobal.process = process;

{{#dependencies}}
{{{.}}};
{{/dependencies}}

// This is a patch for rollup
let module = {
  "type": "wasm-wrapping"
};

const undeftarget = { 

};
const recursivehandler  = {
  get(target, prop, receiver) {
      if(prop in target) {
          return new Proxy(target[prop], recursivehandler)
      }
      return () => {
          console.log("Not implemented", prop, "for", target);
          return new Proxy(target, recursivehandler)
      }
  },
};


let global = new Proxy(undeftarget, recursivehandler);
let flow = new Proxy(undeftarget, recursivehandler);


// Some useful logging
///console.log("Initializing context. Reading msg and node from Node.IO");
let msg = Node.IO.msg();
let node =  Node.IO.node();

const send = Node.IO.send;
const done = Node.IO.done;
const warn = function(msg){
  console.log("Warn", msg)
}
// A lot of aliases
const nodeSend = send;
const nodeDone = done;

node.nodeSend = nodeSend;
node.nodeDone = nodeDone;
node.send = send;
node.done = done;
node.warn = warn;

//console.log(Node.IO.set_result);
const set_result = Node.IO.set_result || ((r) => { return r });

// The dirname is the relative root folder.
// TODO make the call to Node-RED to get it.
const __dirname = ".";
console.log("Starting");
// This disables i18n. In practice we do not need this for the MVP
RED._ = function(obj) {
  return obj;
}

{{{
  inner_code
}}}



function main() {
  // Some useful logging
  // console.log("Executing inside Javy's WASM VM");
  // Fine grained timer

  // let now = Date.now();
  let r = {{mm}}({{{args}}});
  // let elapsed = Date.now() - now;
  
  // console.log("Elapsed time (inside wasm)", elapsed);
  // console.log("Executing inside Javy's WASM VM finishes", r);
  
  // Setting up the global result
  if(r) {
    return set_result(r);
  }
}

main();