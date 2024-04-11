const WASI = require("wasi");
const fs = require("fs");
const debug = "{{{ debug }}}" || false;

function getWasi(){
  const wasi = new WASI({
    version: 'preview1',
    args: [ /* empty for now */ ],
    env: { /* empty for now */ },
    preopens: {

      // TODO This should come from the compiler
      // Eitherway, it should be a separatede folder per file
      '{{{ROOT}}}': '{{{ROOT}}}',
    },
  });

  return wasi
}

// Solves the issue of serializing inherited and circular props
function flatten(obj){
  
  obj.flow = obj._flow;
  // TODO add here other needed info
  return obj
}

function replacer(key, value) {
  // Turn into a hash map
  const cache = new Set();
  return function(key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.has(value)) {
        // Circular reference found
        return `[Circular][${key}]`; // or you can return a string like "[Circular]"
      }
      cache.add(value);
    }
    return value;
  }
}


function get_context(RED, COMMAND_QUEUE, node, instancecb, self, world = ""){
  return {
    "env": {

      "node_red_pop_size": function() {

        {{#CAN_OPERATE_COMMANDS}}
        let peek = COMMAND_QUEUE.pop();
        let json = JSON.stringify(peek, replacer());
        let buffer = new TextEncoder().encode(json);
        if(debug)  console.log("Sending command size", buffer.byteLength, `[${world}]`);
        COMMAND_QUEUE.push(peek);
        return buffer.byteLength;
        {{/CAN_OPERATE_COMMANDS}}
        {{^CAN_OPERATE_COMMANDS}}
        return 0;
        {{/CAN_OPERATE_COMMANDS}}        
      }.bind(self),


      "node_red_pop": function(data, offset, length) {
        {{#CAN_OPERATE_COMMANDS}}
      
        // console.log("QUEUE", COMMAND_QUEUE);
        let json = JSON.stringify(COMMAND_QUEUE.pop(), replacer());
        let buffer = new TextEncoder().encode(json);
        let bytes = new Uint8Array(instancecb().exports.memory.buffer, data + offset, length);
        bytes.set(buffer);
        //if(debug)  console.log("Sending command", data, offset, length, `[${world}]`);
        return buffer.byteLength;
        {{/CAN_OPERATE_COMMANDS}}
        {{^CAN_OPERATE_COMMANDS}}
        return 0;
        {{/CAN_OPERATE_COMMANDS}}
      }.bind(self),
      

      "node_red_msg_size": function() {
          {{#CAN_READ_MSG}}
          // Return the size in bytes of the message encoded as a JSON string 
          let json = JSON.stringify(msg, replacer());
          let buffer = new TextEncoder().encode(json);
          if(debug)  console.log("Sending msg size", buffer.byteLength, `[${world}]`);
          return buffer.byteLength;
          {{/CAN_READ_MSG}}
          {{^CAN_READ_MSG}}
          return 0;
          {{/CAN_READ_MSG}}
      }.bind(self),


      "node_red_node_length": function() {

        {{#CAN_READ_NODE}}
        // Return the size in bytes of the message encoded as a JSON string 
        let json = JSON.stringify(node, replacer()); //flatten(node), replacer()
        let buffer = new TextEncoder().encode(json);
        if(debug) console.log("Sending node struct size", buffer.byteLength, `[${world}]`);
        return buffer.byteLength;
        {{/CAN_READ_NODE}}

        {{^CAN_READ_NODE}}
        return 0;
        {{/CAN_READ_NODE}}
      }.bind(self),

      "node_red_msg": function(data, offset, length){
        {{#CAN_READ_MSG}}
        
        let json = JSON.stringify(msg, replacer());
        let buffer = new TextEncoder().encode(json);
        let bytes = new Uint8Array(instancecb().exports.memory.buffer, data + offset, length);
        bytes.set(buffer);
        if(debug)  console.log("Sending msg", data, offset, length, `[${world}]`);
        return buffer.byteLength;
        {{/CAN_READ_MSG}}
        {{^CAN_READ_MSG}}
        return 0;
        {{/CAN_READ_MSG}}
      }.bind(self),
      "node_red_node": function(data, offset, length){

      
        {{#CAN_READ_NODE}}
        // TODO we need to see the consequences of this
        //node.flow = node._flow;
        let json = JSON.stringify(node, replacer()); // flatten(node), replacer());
        // console.log("host", json);
        let buffer = new TextEncoder().encode(json);
        let bytes = new Uint8Array(instancecb().exports.memory.buffer, data + offset, length);
        bytes.set(buffer);
        //if(debug) console.log("Sending node", data, offset, length, `[${world}]`);
        return buffer.byteLength;
        {{/CAN_READ_NODE}}
        {{^CAN_READ_NODE}}
        return 0;
        {{/CAN_READ_NODE}}
      }.bind(self),

      "node_red_context_size": function() {

        {{#CAN_READ_CONTEXT}}
        // Return the size in bytes of the message encoded as a JSON string 
        let json = JSON.stringify(this.context(), replacer());
        let buffer = new TextEncoder().encode(json);
        if(debug) console.log("Sending node struct size", buffer.byteLength, `[${world}]`);
        return buffer.byteLength;

        {{/CAN_READ_CONTEXT}}
        {{^CAN_READ_CONTEXT}}
        return 0;
        {{/CAN_READ_CONTEXT}}
      }.bind(self),

      "node_red_context": function(data, offset, length){

        {{#CAN_READ_CONTEXT}}
        let json = JSON.stringify(this.context(), replacer());
        let buffer = new TextEncoder().encode(json);
        let bytes = new Uint8Array(instancecb().exports.memory.buffer, data + offset, length);
        bytes.set(buffer);
        if(debug) console.log("Sending node", data, offset, length, `[${world}]`);
        return buffer.byteLength;
        {{/CAN_READ_CONTEXT}}
        {{^CAN_READ_CONTEXT}}
        return 0;
        {{/CAN_READ_CONTEXT}}
      }.bind(self),

      "node_red_send": function(data, offset, length){

        {{#CAN_SEND}}
        if(debug)console.log("Sending data", data, offset, length);
        let d =  instancecb().exports.memory.buffer.slice(data + offset, data + offset + length);
        let buffer = new Uint8Array(d);
        let encoded = new TextDecoder().decode(buffer);
        
        msg = JSON.parse(encoded);
        if(debug) console.log("Calling node send", data, offset, length, `[${world}]`);
        instancecb().send(msg)
        {{/CAN_SEND}}
      }.bind(self),


      "node_emit": function(data, offset, length){

        {{#CAN_EMIT}}
        if(debug)console.log("Emitting data", data, offset, length);
        let d =  instancecb().exports.memory.buffer.slice(data + offset, data + offset + length);
        let buffer = new Uint8Array(d);
        let encoded = new TextDecoder().decode(buffer);
        
        msg = JSON.parse(encoded);
        RED.events.emit(msg.event, msg.payload);

      {{/CAN_EMIT}}
      }.bind(self),


      "node_red_done": function(data, offset, length){

        {{#CAN_DONE}}
        //console.log("Done data", data, offset, length);
        let d =  instancecb().exports.memory.buffer.slice(data + offset, data + offset + length);
        let buffer = new Uint8Array(d);
        let encoded = new TextDecoder().decode(buffer);
        // The message is changed here
        if(encoded){
            msg = JSON.parse(encoded);
            if(debug) console.log("Calling node done", offset, length, `[${world}]`);
            instancecb().done(msg)
        }
        else 
        {
          if(debug) console.log("Calling node done", offset, length, `[${world}]`);
          instancecb().done()
        }

        {{/CAN_DONE}}
      }.bind(self),

      "node_red_warn": function(data, offset, length){
        {{#CAN_WARN}}
     
        //console.log("Done data", data, offset, length);
        let d =  instancecb().exports.memory.buffer.slice(data + offset, data + offset + length);
        let buffer = new Uint8Array(d);
        let encoded = new TextDecoder().decode(buffer);
        console.log("Warn", encoded);
        // The message is changed here
        if(encoded){
            msg = JSON.parse(encoded);
            if(debug) console.log("Calling node done", data, offset, length, `[${world}]`);
            if(instancecb().warn)
              instancecb().warn(msg)
        }
        {{/CAN_WARN}}

      }.bind(self),
     
      "node_red_error": function(data, offset, length){
        {{#CAN_ERROR}}

        //console.log("Done data", data, offset, length);
        let d =  instancecb().exports.memory.buffer.slice(data + offset, data + offset + length);
        let buffer = new Uint8Array(d);
        let encoded = new TextDecoder().decode(buffer);
        console.log("Error", encoded);
        // The message is changed here
        if(encoded){
            msg = JSON.parse(encoded);
            if(debug) console.log("Calling node done", data, offset, length, `[${world}]`);
            if(instancecb().warn)
              instancecb().error(msg)
        }
        {{/CAN_ERROR}}

      }.bind(self),

      "node_red_result": function(data, offset, length){
        {{#CAN_PUSH_RESULT}}

        if(debug) console.log("Setting global result", `[${world}]`);
        // Set a custom value here
        let d =  instance().exports.memory.buffer.slice(data + offset, data + offset + length);
        let buffer = new Uint8Array(d);
        let encoded = new TextDecoder().decode(buffer);
        data = JSON.parse(encoded);

        GLOBAL_RESULT.push(data);
        {{/CAN_PUSH_RESULT}}

      }.bind(self),

      "node_red_register": function(data, offset, length){
        // Set a custom value here
        let d =  instancecb().exports.memory.buffer.slice(data + offset, data + offset + length);
        let buffer = new Uint8Array(d);
        let encoded = new TextDecoder().decode(buffer);
        data = JSON.parse(encoded);

        
        if(debug) console.log("[Wrapper] Registering node", data, `[${world}]`);
        if(debug) console.log("[Wrapper] making a stateful instance", instancecb(), `[${world}]`);
        function wrappernode(newnode){
           RED.nodes.createNode(this, newnode);
           let augmentednode = this;
           // console.log(this._flow);
           //console.log(this, newnode, augmentednode);
            
           // Here we instantiate a node with the same properties as the one we are wrapping
           if(debug) console.log("Calling node constructor");
           const wasm = new WebAssembly.Module(fs.readFileSync("./user-dir/wasm-red.{{{ wasmfile }}}.wasm"));
       
           // Should be save the instance to keep a state ?
           // TODO do we need a fresh instance of WASI ?
           const wasi = getWasi();
           // TODO do we need a fresh instance of Wasm
           const instance = new WebAssembly.Instance(wasm, {      
            'wasi_snapshot_preview1': wasi.exports,
              ...get_context(RED, COMMAND_QUEUE, augmentednode, () => instance /**/, this, "instance")
            });
            
           COMMAND_QUEUE.push({
              "type": "init",
              "name": data.constructor
            })

            instance.warn = augmentednode.warn;
            wasi.setMemory(instance.exports.memory);
            instance.exports._start();
            //wasi.start(instance);
            instance.exports.javyinit();


           // instance.exports.invoke to initialize the instance and its initial state
           // TODO replace by a wrapper function
           this.on('input', function(msg, send, done, warn) {
              
              instance.send = send;
              instance.done = done;
              instance.warn = warn || augmentednode.warn ;
              COMMAND_QUEUE.push({
                "type": "on",
                "event": "input",
                "msg": msg,
                "cl": data.constructor
              })
              
              instance.exports.javyprocessmessage();
              // instance.exports.on("input", msg);
           });
        };
        RED.nodes.registerType(data.name, wrappernode, data.options);
        if(debug) console.log("[Wrapper] Node registered", `[${world}]`);
      }.bind(self)

   }
  }
}

module.exports = function(RED){
    
    // Since the entry point of the module is always the same, we need to 
    // address their behavior by passing messages to it
    let COMMAND_QUEUE = [];    
    const wasm = new WebAssembly.Module(fs.readFileSync("./user-dir/wasm-red.{{{ wasmfile }}}.wasm"));

    
    const wasi = getWasi();

    if(debug) console.log("[Wrapper] Wasi loaded");
    // The instantiation of the Wasm module can be avoided every time 
    // if for example, we have a pool of instances previously
    const instance = new WebAssembly.Instance(wasm, {
      'wasi_snapshot_preview1': wasi.exports,
      // This is a static stage, so, no node instace neither Wasm instance
      ...get_context(RED, COMMAND_QUEUE, null, () => instance, this, "register")
    });
    
    if(debug) console.log("[Wrapper] Instance created. Calling start to invoke the node registration");
    // Start the timer here to se the impact of the instantiation
    // Move it along to include other computations, for example the call to WebAssembly instantiate
    COMMAND_QUEUE.push({
      "type": "register",
    })
    wasi.setMemory(instance.exports.memory);
    instance.exports._start();
    console.log("[Wrapper] calling register node inside the Wasm file");
    instance.exports.javyregisternode()
}