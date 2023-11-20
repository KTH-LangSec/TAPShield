// Implement a proxy here, it will be better
// TODO replace by a Javy wrapper, it will be better for the file node :)

class Writer{
    constructor(path, options) {
        console.log("Writer", path, options)
        this.callbacks = {};
        this.offset = 0;
        this.chunk = null;
        this.length = -1;
        this.written = 0;
        this.path = path;
        this.options = options;
        this._readableState = { 
            highWaterMark: 64*1024
        }
        this.messages = []

        
        //console.log("Reader", path);
        // Deferred initialization
        Promise.resolve().then(() => this._initialize());
    }


    async _initialize() {
       
        console.log("Initializing", this.path);
        try{
            let flag = this.options && this.options.flag? this.options.flag : 'w';
            // truncate file
            let mt = Node.FS.openwrite(this.path, flag);       
            if(mt){
                console.log("Emiting open from init");
                this.emit("open");
                this.emit("ready");
            } else {
                // This is probably a permission error
                console.log("[WASM] Error initializing", JSON.stringify(mt));
                this.emit("error", "File could not be accessed " + this.path);
            }
        } catch(e){
            console.log("Error", e.message)
            this.emit("error", e.message);
        }
    }

    bytesWritten() {
        return this.written;
    }


    emit(event, ...args){
        console.log("Emiting", event);
        if(this.callbacks[event]){
            for(let cb of this.callbacks[event])
                cb(args)
        }
        else{
            this.messages.push([event, args]);
        }
    }

    on(event, callback) {
       //this.initializedPromise.then(() => {
        console.log("On register", event);
        if (this.callbacks[event]) {
            this.callbacks[event].push(callback);
        } else {
            this.callbacks[event] = [callback];
        }

        // Check if there are un processed messages
        for(let i=0;i < this.messages.length; i++ ){
            if(this.messages[i]){
                let [event, args] = this.messages[i];
                console.log("Calling callback for", event, "with", args);
                // Mark msg to remove
                this.messages[i] = null;
                for(let cb of this.callbacks[event])
                    cb(args)
                console.log("On register 1", JSON.stringify(this.messages));
            }
        }

        // Remove null messages
        this.messages = this.messages.filter((x) => x != null);
        
        return this;
    }

    once = this.on;

    write(data, cb){
        let n = Node.FS.writeFileSync(this.path, data, this.offset, 'a');
        this.written += n;
        this.offset += n;

        if(cb)
            cb();
    };


    end(chunk){
        console.log("End", chunk.byteLength, chunk.length);
        let n = Node.FS.writeFileSync(this.path, chunk, this.offset,  'a');
        this.written += n;
        this.offset += n;

        this.emit("close")
    }

}

class Reader {
    constructor(path) {

        console.log("Reader", path, options)
        this.callbacks = {};
        this.offset = 0;
        this.chunk = null;
        this.length = -1;
        this.fixedsize = 1024;
        this.path = path;
        this._readableState = { 
            highWaterMark: 64*1024
        }
        this.messages = []
        
        //console.log("Reader", path);
        // Deferred initialization
        Promise.resolve().then(() => this._initialize());
    }


    async _initialize() {
       
        console.log("Initializing", this.path);
        try{
            let mt = Node.FS.statSync(this.path, "r");       
            this.length = mt.size;

            if(this.length >= 0){
                console.log("Emiting readable from init");
                this.emit("readable");
            } else {
                // This is probably a permission error
                console.log("[WASM] Error initializing", JSON.stringify(mt));
                this.emit("error", "File could not be accessed " + this.path);
            }
        } catch(e){
            console.log("Error", e.message)
            this.emit("error", e.message);
        }
    }

    pipeline(){
        console.log("TODO pipeline");
    }

    emit(event, ...args){
        console.log("Emiting", event);
        if(this.callbacks[event]){
            for(let cb of this.callbacks[event])
                cb(args)
        }
        else{
            this.messages.push([event, args]);
        }
    }

    on(event, callback) {
       //this.initializedPromise.then(() => {
        console.log("On register", event);
        if (this.callbacks[event]) {
            this.callbacks[event].push(callback);
        } else {
            this.callbacks[event] = [callback];
        }

        // Check if there are un processed messages
        for(let i=0;i < this.messages.length; i++ ){
            if(this.messages[i]){
                let [event, args] = this.messages[i];
                console.log("Calling callback for", event, "with", args);
                // Mark msg to remove
                this.messages[i] = null;
                for(let cb of this.callbacks[event])
                    cb(args)
                console.log("On register 1", JSON.stringify(this.messages));
            }
        }

        // Remove null messages
        this.messages = this.messages.filter((x) => x != null);
        
        return this;
    }

    read(){

        // this.initializedPromise.then(() => {
            // Read chunk from chunk
            let [n, chunk] = Node.FS.readFileChunk(this.path, this.offset, this.fixedsize, 'r');
            console.log("Read", n, chunk.length, this.offset);
            this.offset += n;
            // Cut zeros from chunk
            chunk = chunk.slice(0, n);
            this.chunk = chunk;
            if(n == 0){
                this.emit("end");
                return null
            } else {
                this.emit("data", chunk);
                // return chunk as Buffer
                let buffer = new Buffer(chunk);
                return buffer;
            }
        //})
    };

}


const target = { 
    createWriteStream(path){
        
        console.log("write stream path", path);
        let reader = new Writer(path);
        return reader;
        
    },
    createReadStream(path){
        console.log("read stream path", path);
        let reader = new Reader(path);
        return reader;
    },
    readFileSync(path){
        console.log("read file path", path);
        let mt = Node.FS.statSync(path, 'r');
        if(mt.size >= 0){
            let data = new ArrayBuffer(mt.size);
            Node.FS.readFileSync(path, data, 0, mt.size, 0, 'r');
            return data;
        } else {
            Node.IO.warn("File could not be accessed " + path);
            return null
        }
    },
    stat(path, cb){
        console.log("Stat ", path);
    },
    unlink(path, cb){
        console.log("unlink", path)
    },
    statSync(path){
        console.log("Stat sync", path);
    },
    mkdir(path, mode, cb){
        console.log("mkdir", path, mode)
    },
    mkdirSync(path, mode){
        console.log("mkdir sync", path, mode)
    }
};
const handler1  = {
    get(target, prop, receiver) {
        if(prop in target) {
            return new Proxy(target[prop], handler1)
        }
        return () => {
            console.log("FS: Not implemented", prop);
            return null;
        }
    },
  };
  
// console.log("FS requested");
module.exports = target;