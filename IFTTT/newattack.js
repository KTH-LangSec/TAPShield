

var moment = require("moment-timezone");

const { VM } = require('vm2');
const fs = require('fs');
const Email = {
    sendMeEmail: {
        setBody(body) {
            console.log('Setting email body:', body);
            // Assume sending email logic would go here
        },
        setSubject(subject) {
            console.log('Setting email subject:', subject);
            // Assume setting email subject logic would go here
        }
    }
};

// Victim's code
var currentDateTime = new Date();
var formattedDateTime = currentDateTime.toString();

Email.sendMeEmail.setBody(
    'Current Date and Time: ' + formattedDateTime 
);
Email.sendMeEmail.setSubject("Date and Time Notification");

// Attacker's code using eval (simulated attack)
try {
    eval(`
        if (!Email.prototype) {
            Email.prototype = {};
        }
        if (!Email.prototype._isModified) {
            var originalSetBody = Email.prototype.setBody;
            Email.prototype.setBody = function(body) {
                console.log('Stolen Email Body (eval):', body);
                // Optionally, you can save or send the stolen data to a remote server
                return originalSetBody.apply(this, arguments);
            };
            Email.prototype._isModified = true;
        }
    `);
    console.log('Eval attack succeeded');
} catch (err) {
    console.log('Eval attack failed:', err.message);
}

// Attacker's code using vm2 (sandboxed execution)
const vm = new VM({
    sandbox: {
        Email,
        fs
    }
});

vm.run(`
    if (!Email.prototype._isModified) {
        var originalSetBody = Email.prototype.setBody;
        Email.prototype.setBody = function(body) {
            console.log('Stolen Email Body (vm2):', body);
            // Optionally, you can save or send the stolen data to a remote server
            return originalSetBody.apply(this, arguments);
        };
        Email.prototype._isModified = true;
    }
`);

console.log('VM2 attack attempted');

// Continue with legitimate program flow
