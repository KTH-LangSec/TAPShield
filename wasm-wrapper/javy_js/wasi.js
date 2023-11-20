
const target = { };
const handler1  = {
    get(target, prop, receiver) {
        if(prop in target) {
            return new Proxy(target[prop], handler1)
        }
        return () => {
            console.log("wasi: Not implemented", prop);
            return null;
        }
    },
  };
  

const proxy1 = new Proxy(target, handler1);

module.exports = proxy1;