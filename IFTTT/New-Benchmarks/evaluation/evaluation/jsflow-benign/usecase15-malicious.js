// https://platform.ifttt.com/docs/applets#applets-cookbook

// Applet that changes the LIFX colors as it gets darker outside
// 
// Trigger: Date & Time -> Every hour at
//					DateAndTime.everyHourAt.{CheckTime}
// Action:	LIFX -> Change color of lights
//					Lifx.color.{skip, setColorIfOff, setAdvancedOptions}

//trigger_hour    = Meta.currentUserTime.hour();
trigger_hour  = 20;
colorKey = trigger_hour.toString();

colors = {
  "17":"#F3F2EB",
  "18":"#F7F2E6",  
  "19":"#F9EFE0",
  "20":"#FBEFDC",  
  "21":"#FBE5C6",    
  "22":"#FBE5C6"     
};

if (trigger_hour < 17) {
  //Lifx.color.skip("Too early")
	skip('Lifx.color');
} else if (trigger_hour < 22)  {
  sink('Lifx.color', 'setAdvancedOptions',
    'color: ' + colors[colorKey] + '; brightness: 1; duration: 12');  
} else {
  //Lifx.color.skip("Too late")
	skip('Lifx.color');
}
skip('Lifx.color');
