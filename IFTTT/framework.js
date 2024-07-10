
var moment = require("moment-timezone");
const path = require("path");
const fs = require("fs");
const { performance } = require('perf_hooks')
const sandtrap = require("sandtrap");

/** * Run a block of filter/transform code with the given config.
* * NOTE: This code depends on moment.js and moment-timezone being loaded. It
* would be nicer to use pure JS, but timezone support in JS is basically
* non-existent. * * @param {string} filterCode - The code to run.
* @param {Object} config - Contextual information about the applet and
* the current applet run. * @param {string} config.timeZone - The user's time zone.
* @param {string} config.triggerTime - The time the trigger event happened.
* @param {string} config.currentTime - The time this code is running.
* @param {Object} config.trigger - An object of metadata about the trigger
* with the keys `serviceName`, `name`, and `ingredients`. `ingredients` is a
* map of ingredients from the trigger, with each key in UpperCamelCase
* format and each value as a string (for now).
* @param {Array} config.actions - An array of metadata about the * available actions. Each entry is an object with the keys `serviceName`,
* `name`, and `fields`. `fields` is an array of UpperCamelCase module names * for the fields. */
function runScriptCode(filterCode, config) {
   
    var __services = {}
    var Meta = {
        currentUserTime: moment(config.currentTime).tz(config.timeZone)
    }
    Meta.triggerTime = config.triggerTime === null ? null : moment(config.triggerTime).tz(config.timeZone) 
////////
var Trigger = config.trigger.ingredients

    //********COMMENT FOR DEPLOYMENT
    if (Trigger.startsWith("{")) Trigger = JSON.parse(Trigger)

        if (!__services[config.trigger.serviceName]) {
            __services[config.trigger.serviceName] = {}
        }
        __services[config.trigger.serviceName][config.trigger.name] = Trigger
///////
config.actions.forEach(function(actionConfig) {
    if (!__services[actionConfig.serviceName]) {
        __services[actionConfig.serviceName] = {}
    }
    var action = new Action() 
    actionConfig.fields.forEach(function(fieldName) {
        action["set" + fieldName] = function(value) {
            action[fieldName] = value
        }
    }) 
    __services[actionConfig.serviceName][actionConfig.name] = action
})




var mode = process.argv[3] //'-o' for original ifttt, '-s' for +sandtrap, '-v' for +vm2
switch(mode) {


    /************IFTTT***************/
    case '-o':

    console.log("#Original IFTTT is running#")
    // We need to use `eval` to set up constants like `Twitter` since otherwise
    // they won't be scoped properly.
    const argIndex = process.argv.indexOf("-o");
    const i = process.argv[argIndex - 1];
    const logFilePath = path.join('logs', `output_${i}.log`);
    
    function logToFile(message , path){
        fs.appendFile(path, message.toString() + "\n" , function (err){
            if (err) throw err;
            console.log("done");
        });
    }
    // console.time('ifttt-time');
    const startTime = performance.now();
    eval(Object.keys(__services).map(function(serviceName) { 
        return "var " + serviceName + " = __services." + serviceName + ";" }).join("\n") ) ;
    eval(filterCode);
    // console.timeEnd('ifttt-time');
    const endTime = performance.now();
    const iftttExecutionTime = endTime - startTime;
    logToFile(iftttExecutionTime, logFilePath); 
    
    break;





    /**********SandTrap***********/
    case '-s':

    console.log("#IFTTT+SandTrap is running#")

    let policy = new sandtrap.Policy.Basic.Policy("./policy/", "sandbox.policy", Trigger);
    console.time("sandtrap-time");
    // const argSIndex = process.argv.indexOf("-s");
    // const j = process.argv[argSIndex - 1];
    // console.log(j)
    // const logFilePathSand = path.join('logs', `output_${j}.log`);
    
    // let newstartTime = performance.now();
    // Start SandTrap Process 
    let sandbox = new sandtrap.SandTrap(policy);
    Object.keys(__services).map(function(serviceName) {
      sandbox.ContextifyObject(__services[serviceName], serviceName);     
  })
    sandbox.ContextifyObject(Meta, "Meta")
    sandbox.ContextifyObject(moment, "moment")
    sandbox.ContextifyObject(Trigger, "Trigger")

    sandbox.Eval(filterCode, "filtercode-policy");
    // End SandTrap Process 
    console.timeEnd("sandtrap-time");
    // let newEndTime = performance.now();
    // let iftttExecutionTimeSand = newEndTime - newstartTime;
    // logToFile(iftttExecutionTimeSand , logFilePathSand); 

    break;

    /*********VM2************/
    case '-v':

    console.log("#IFTTT+VM2 is running#")

    const {NodeVM} = require('vm2');

//IFTTT version
    console.time("vm2-time");
    //run vm2
    const argSIndex = process.argv.indexOf("-v");
    const j = process.argv[argSIndex - 1];
    console.log(j)
    const logFilePathSand = path.join('logs', `output_${j}.log`);
    
    let newstartTime = performance.now();

    const vm = new NodeVM({
      console: 'inherit', //default
      sandbox: __services,
      eval: false, //default : true
      require: {
          external: false,//default
          builtin: [],//default
          root: "./",
          mock: {}
      }
  });
    
      //more SECURE version - 'moment, Meta, Trigger' freezed

      vm.freeze(moment, 'moment');
      vm.freeze(Meta, 'Meta'); //redundant, moment would be sufficient
      vm.freeze(Trigger, 'Trigger'); //redundant, moment would be sufficient
      
    //the new eval filtercode!
    vm.run(filterCode); 
    console.timeEnd("vm2-time");
    newEndTime = performance.now();
    let iftttExecutionTimeVM2 = newEndTime - newstartTime;
    logToFile(iftttExecutionTimeVM2 , logFilePathSand); 
    break;




    default:
    console.error('!!!choose a mode (original, or +sandtrap, or +vm2)!!!')
    return;

    
}  


    // Don't return the ingredients, just action fields/skips
    delete __services[config.trigger.serviceName][config.trigger.name] 
    return __services 
}
/** * A constructor for objects representing individual actions. */
function Action() {}
/** * Skip the given action, optionally providing a user-facing reason. */
Action.prototype.skip = function(reason) { this.__skipped = true; 
    this.__skipReason = reason; } 
    if (module) {
     // ExecJS does not support module
     module.exports = runScriptCode; 
 }
