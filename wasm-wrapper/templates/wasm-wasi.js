const WASI = require("wasi");
const fs = require("fs");

//  Use import instead
// const WASI = require('wasi');
// console.log(WASI.WASI);
// const fs = require('fs');
const debug = "{{{ debug }}}" || false;
const time = "{{{ time }}}" || false;

// GLOBAL_CACHE = GLOBAL_CACHE || this.GLOBAL_CACHE ;  
// start = start || (() => {});

module.exports = function(start, report_time, GLOBAL_CACHE, node){

  return (msg, send, done) => {

    console.log("Calling Wasm code :)")
    const wasm = new WebAssembly.Module(fs.readFileSync("{{{ wasmfile }}}"));

    const wasi = new WASI.WASI({
        version: 'preview1',
        args: [ /* empty for now */ ],
        env: { /* empty for now */ },
        preopens: {
          // '/sandbox': '/dev/',
        },
      });

    // The result if the STACK
    let GLOBAL_RESULT = [];
    // The instantiation of the Wasm module can be avoided every time 
    // if for example, we have a pool of instances previously
    const instance = new WebAssembly.Instance(wasm, {
      ...wasi.getImportObject(),
      "env": {
        // Compile time enforced
        {{#CAN_READ_MSG}}
          "node_red_msg_size": function() {
            // TODO we need to see the consequences of this
            if(!node._flow)
              node._flow = {};
            // Return the size in bytes of the message encoded as a JSON string 
            let json = JSON.stringify(msg);
            let buffer = new TextEncoder().encode(json);
            if(debug)  console.log("Sending msg size", buffer.byteLength);
            return buffer.byteLength;
          },
        {{/CAN_READ_MSG}}
        
        {{#CAN_READ_NODE}}
          "node_red_node_size": function() {
            // Return the size in bytes of the message encoded as a JSON string 
            let json = JSON.stringify(node);
            let buffer = new TextEncoder().encode(json);
            if(debug) console.log("Sending node struct size", buffer.byteLength);
            return buffer.byteLength;
        },
        {{/CAN_READ_NODE}}


        {{#CAN_READ_MSG}}
        "node_red_msg": function(data, offset, length){
          let json = JSON.stringify(msg);
          let buffer = new TextEncoder().encode(json);
          let bytes = new Uint8Array(instance.exports.memory.buffer, data + offset, length);
          bytes.set(buffer);
          if(debug)  console.log("Sending msg", data, offset, length, msg);
          return buffer.byteLength;
        },
        {{/CAN_READ_MSG}}


        {{#CAN_READ_NODE}}
        "node_red_node": function(data, offset, length){
          // TODO we need to see the consequences of this
          if(!node._flow)
            node._flow = {};
          let json = JSON.stringify(node);
          console.log(json);
          let buffer = new TextEncoder().encode(json);
          let bytes = new Uint8Array(instance.exports.memory.buffer, data + offset, length);
          bytes.set(buffer);
          if(debug) console.log("Sending node", data, offset, length);
          return buffer.byteLength;
        },
        {{/CAN_READ_NODE}}


        {{#CAN_SEND}}
        "node_red_send": function(data, offset, length){
          if(debug)console.log("Sending data", data, offset, length);
          let d =  instance.exports.memory.buffer.slice(data + offset, data + offset + length);
          let buffer = new Uint8Array(d);
          let encoded = new TextDecoder().decode(buffer);
          // The message is changed here
          msg = JSON.parse(encoded);
          if(debug) console.log("Calling node send", data, offset, length);
          send(msg)
        },
        {{/CAN_SEND}}

        {{#CAN_DONE}}
        "node_red_done": function(data, offset, length){
          if(debug)console.log("Done data", data, offset, length);
          let d =  instance.exports.memory.buffer.slice(data + offset, data + offset + length);
          let buffer = new Uint8Array(d);
          let encoded = new TextDecoder().decode(buffer);
          // The message is changed here
          if(encoded){
              msg = JSON.parse(encoded);
              if(debug) console.log("Calling node done", data, offset, length);
              done(msg)
          }
          else 
          {
            if(debug) console.log("Calling node done", data, offset, length);
            done()
          }
        },
        {{/CAN_DONE}}

        {{#CAN_PUSH_RESULT}}
        "node_red_result": function(data, offset, length){
          if(debug)  console.log("Setting global result");
          // Set a custom value here
          let d =  instance.exports.memory.buffer.slice(data + offset, data + offset + length);
          let buffer = new Uint8Array(d);
          let encoded = new TextDecoder().decode(buffer);
          data = JSON.parse(encoded);

          GLOBAL_RESULT.push(data);
        }
        {{/CAN_PUSH_RESULT}}
      }
    });

    // Start the timer here to se the impact of the instantiation
    // Move it along to include other computations, for example the call to WebAssembly instantiate
    if(time)
      start()
    wasi.start(instance);
    if(time){
      let duration = report_time()
      msg.duration = duration;
    }
  }
}