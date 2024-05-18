// const runScriptCode = require('./framework');


/** * If we're running in Lambda, provide an API Gateway interface. */ 
if (typeof exports !== "undefined") {
    exports.handler = function(event, context, callback) {
        try {
            
            //********UNCOMMENT FOR DEPLOYMENT
            //****you should also *COMMENT* line 37 framework.js (JSON.parse(Trigger))
            // let data = JSON.parse(event.body);
            let data = event.body;

            const runScriptCode = require('./framework');
            
            
            
            let result = runScriptCode(data.scriptCode, data.config) 
            callback(null, {
                statusCode: 200,
                body: JSON.stringify(result),
                headers: {
                    "Content-Type": "application/json"
                }
            })
        } catch (e) {
           
            callback(null, {
                statusCode: 400,
                body: ({
                // body: JSON.stringify({
                    // event: JSON.stringify(event),
                    event: event,
                    message: (e && e.toString()) || "Something went wrong",
                    stack: (e && e.stack) || ""
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
        }
    }
}
