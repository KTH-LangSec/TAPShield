// https://platform.ifttt.com/docs/applets#applets-cookbook

// Example: Random light colors
// Applet description
// 
//     Random light colors
//     Change your LIFX colors to a random color
// 
// Trigger
// 
//     Button Widget: Button Press
// 
// Filter code

var colors = ["#FF8400", "#FF0000", "#15FF00", "#FF00D4","#00D4FF","#003CFF"]
var index = Math.floor((Math.random() * colors.length))
Lifx.color.setAdvancedOptions('color: ' + colors[index] + '; brightness: 1; duration: 12')

// Action(s)
// 
//     Lifx: change color of lights

