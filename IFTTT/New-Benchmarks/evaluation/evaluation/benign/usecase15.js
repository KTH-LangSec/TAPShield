// https://platform.ifttt.com/docs/applets#applets-cookbook

// Example: Adjust your lights as it gets darker outside
// Applet description
// 
//     Adjust your lights as it gets darker outside
//     Change your LIFX light bulbs to reflect the color outside and have a more natural color as it gets darker outside
// 
// Trigger
// 
//     Date & Time: Every hour
// 
// Filter code

var hour     = Meta.currentTime.hour()
var colorKey = hour.toString()

var colors: {[key:string]:string} = {
  "17":"#F3F2EB",
  "18":"#F7F2E6",  
  "19":"#F9EFE0",
  "20":"#FBEFDC",  
  "21":"#FBE5C6",    
  "22":"#FBE5C6"     
}

if (hour < 17) {
  Lifx.color.skip("Too early")
} else if (hour < 22)  {
  Lifx.color.setAdvancedOptions(
    'color: ' + colors[colorKey] + '; brightness: 1; duration: 12'
  )  
} else {
  Lifx.color.skip("Too late")
}

// Action(s)
// 
//     Lifx: change color of lights
