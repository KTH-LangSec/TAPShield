//node invoker.js # -o|s|v, where # is a placeholder for number e.g., 1 for /benchmark/1.json


var lambdaFunction = require('./lambda_interface');
var functionHandler = 'handler';

 let event = require('./event.json');

if (process.argv[2]){//for benchmark
event = require('./benchmark/' + process.argv[2] + '.json')
}
var context = {};

function callback(error, data){
    console.log(error);
    console.log(data);
}

lambdaFunction[functionHandler](event, context, callback);