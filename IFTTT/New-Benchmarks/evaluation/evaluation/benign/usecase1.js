// https://www.reddit.com/r/ifttt/comments/7we0p4/simple_filter_code_needed_please/

// Hi. I have began to understand the javascript for filtering ifttt triggers. Just beginning! But i would really appreciate if anyone has time just to tell the code needed. I'm using Nest to trigger and lightwaverf power socket to switch on. ( and I'll write applet another one to switch it off). I just want it to activate between 0900 & 1800 every day.
// 
// The code is something like this??

var timeOfDay = Meta.currentUserTime.hour(); if (timeOfDay > 18 || timeOfDay < 9)

// Just trying to copy and paste examples I've seen but guess it needs the word "skip" in it somewhere?

// Thanks very much.


var time = Meta.currentUserTime.hour();
if (time > 18 || time < 9) {
    LightwaverfPower.switchOnSocket.skip();
}
else { 
   //Continue running as usual
}

// That should work if you only want it to run between the hours of 9AM and 6PM. Just so you know the options for what you can use with your selected trigger and action are on the right hand side. Thats where that skip line comes from.

