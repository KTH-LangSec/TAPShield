
// import red_util from 'red_util';
// import red_log from 'red_log';
// import { _ } from 'ajv';
//import express from "express";

{{{
  inner_code
}}}

let MODE = "Register";
let CL = 'constructorname';

const recursivehandler  = {
  get(target, prop, receiver) {
      if(prop in target) {
          return new Proxy(target[prop], recursivehandler)
      }
      return () => {
          console.log("Not implemented", prop, "for", target);
          // TODO ask the host for this property
          return new Proxy(target, recursivehandler)
      }
  },
};



// Callbacks for on('input', callback)
let callbacks = {

}

// Inside context
let CONTEXT = {};

// This adds information inherited when a createNode function is called
// See Node.js:37
function wrapnodehinerit(obj){
  obj._flow = obj.flow;
  delete obj.flow;
}

// TODO
function wrapmetrics(obj){
  obj.metric = function(){
    return false;
  }
}

// TODO
// Wraps the communication with the host context object
function wrapcontext(obj){
  obj.context = function(){
      let r = Node.IO.context();
      // The new coming and the already saved here
      // so every time it is requested, the outside values are 
      // wiped out ? 
      // TODO check policy here
      CONTEXT = {...r, ...CONTEXT};
      return {
        ...CONTEXT,
        // This is for the 10-function node
        global: {
          get(key){
            console.log("TODO, requesting from global", key);
          },
          set(key, value){
            console.log("TODO, setting global", key, value);
          }
        },
        set(key, value){
          CONTEXT[key] = value;
          // TODO call the host
        },
        get(key){
          // TODO call the host
          if(CONTEXT[key]){
            return CONTEXT[key];
          }
          return undefined
        }
      }
  }
}

function initialize(CL){
   // Get the node from the host
    console.log(Node.IO.node);
    let node = Node.IO.node();
    console.log("Getting node");
    // set a function as its context
    wrapcontext(node);
    wrapmetrics(node);
    wrapnodehinerit(node);

    let pnode = new Proxy(node, {
       set(obj, prop, value){
           console.log("Setting", prop, "to", obj, "as", value);
           return Reflect.set(...arguments);
       }
    });

    // A wrapper for the node instance
    // It communicates with the host 
    
    let self = {
        ...node,
        on: function(event, callback){
          if(!callbacks[event])
            callbacks[event] = [];
          callbacks[event].push(callback.bind(self));
        },
        send: function(msg){
           Node.IO.send(msg)
        },
        done: function(msg){
          Node.IO.done(msg)
        },
        error: function(err, msg){
          // console.log("[WASM] err", err);
          Node.IO.error(msg);
        },
        warn: function(msg){
          Node.IO.warn(msg)
        },
        status(payload){
          // Node.IO.status(payload)
          console.log(JSON.stringify(payload))
        },
        filename: './input.txt'
    };

    let bound = CL.bind(self);
    console.log("Calling constructor");
    bound(pnode);
    //console.log("[WASM] self", JSON.stringify(self));
}

const RED = {
 // httpNode: express() /*{
  //  get(url, ...args){
      // We simulate the express app
      // In the context of each middleware, next means to pass the token to the next middleware
      // or to the handler
      
  //  }
  //}*/,
  _: function(msg){
    // THis is usually i18n
    // We skip its implementation for now
    // Ideally should be a comm between the host and the wasm 
    return msg;
  },
  log: new Proxy({}, recursivehandler),
  util: new Proxy({
    cloneMessage(msg){
      // Solve this here
      // Can we return msg...it is a fresh copy in the instance run anyways ?
      return msg;
   },
   getMessageProperty(msg, prop){
      return msg[prop];
   },
   setMessageProperty(msg, prop, value){
      msg[prop] = value;
   }
  }, recursivehandler),
  settings: {
    fileWorkingDirectory: ''
  },
  library: {
    register(name){
      //console.log("Register", name);
    }
  },
  events: {
    on(event, callback){
      console.log("TODO Event callback", event);
    },
    once(event, callback){
      console.log("TODO Event once", event);
    },
    removeListener(event, callback){
      console.log("TODO Remove listener", event);
    },
    emit(event, payload){
      console.log("TODO Event emit", event);
    }
  },
  httpAdmin: {
    // TODO should call the host
    post(url, ...args){
      // This should call the host and creates a new post entry that interacts with this instance
      // post(url, cb1, cb2, cb3)
      // -> host 
      //        |
      //         -> 
      console.log("TODO httpAdmin post", url);
    },
    get(url, ...args){
      // This should call the host and creates a new get entry that interacts with this instance
      console.log("TODO httpAdmin get", url);
    },
  },
  auth: {
    needsPermission(permission){
      console.log("TODO auth needsPermission", permission);

      return true
    }
  },
  comms: {
    publish: function(topic,data,retain) {
      // Call the host
      //console.log("TODO port comms publish", topic, data, retain); 
      
      Node.IO.emit("comms",{
          topic: topic,
          data: data,
          retain: retain
      })
    }
  },
  nodes: {
    registerType: function (name, constructor, options = {}) {

      const constructorname = constructor.name || name;
      // This call the host to register itself
      console.log("[WASM] Setting register:", constructorname, MODE);
      this.constructorname = constructor;
      if(MODE == 'Register'){
        console.log("[WASM] registering node", name, constructorname);
        Node.IO.register_type(
          name, constructorname, options
        )
      }
      else if(MODE === 'init' && constructorname === CL){
        initialize(constructor)
      }
      else {
        console.log("[WASM] Invalid command", MODE);
        throw Exception("Invalid command");
      }
    },
    createNode: function (self, node) {
      node = { ...Node.IO.node(),  };
      wrapcontext(node);
      wrapnodehinerit(node);
      //console.log("Do something with this. create Node")
      // node.nodes.createNode(self, node);
    }
  }
}
/*
function new(constructorname){
  console.log("Initializing the node", constructorname);
  module.exports(RED)[constructorname];
}*/

export function javyregisternode() {
  let command = Node.IO.pop();

  //console.log("[WASM] Command", JSON.stringify(command));
  if(command.type === 'register'){
      MODE = 'Register';
  }else {
    throw Exception("Invalid command for Register");
  }
  nodemod(RED);
  
  console.log("[WASM] register node")
}


export function javyinit() {
  // console.log("[WEASM] Initializing");
  let command = Node.IO.pop();

  // console.log("[WEASM] Received");

  // console.log("[WASM] Command", JSON.stringify(command));
  if(command.type === 'init'){
      MODE = 'init'; 
      CL = command.name;
  } else {
      throw Exception("Invalid command for init");
  }

  console.log(nodemod);
  nodemod(RED);
  
  console.log("[WASM] init node")
}

export function javyprocessmessage(){
  let command = Node.IO.pop();
  //console.log("[WASM] processing", JSON.stringify(command));
  if(command.type == 'on'){
     let eventname = command.event;
    
     for(let cb of callbacks[eventname]){
       cb(command.msg, Node.IO.send, Node.IO.done);
     }
  }
}


