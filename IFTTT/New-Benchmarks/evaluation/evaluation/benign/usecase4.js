// https://www.reddit.com/r/ifttt/comments/7behu1/recipe_javascript_filter_code/

// I have an applet that uses the DO button and right now it runs anytime. I need to add Javascript filter code that says: run if DAY = SUNDAY and TIME = 8am - Noon (Eastern Standard Time)


var time = Meta.currentUserTime.hour();
var d = new Date();
var day = d.getDay();
if ( time >= 8 || <= 12 ) && ( day == 0 ){
// continue doing what you were going to do
}
else {
//Add whatever code you need to get it to skip running here
}

// Should work. Just replace the second code block with whatever it is on the right hand side to stop the trigger. 
