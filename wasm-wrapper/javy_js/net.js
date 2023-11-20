// Implement a proxy here, it will be better
// TODO replace by a Javy wrapper, it will be better for the file node :)

const target = { 
    readFileSync(path){
        return path
    },
};
const handler1  = {
    get(target, prop, receiver) {
        if(prop in target) {
            return new Proxy(target[prop], handler1)
        }
        return () => {
            console.log("net: Not implemented", prop);
            return null;
        }
    },
  };
  

const proxy1 = new Proxy(target, handler1);

module.exports = proxy1;