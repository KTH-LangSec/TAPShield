// https://platform.ifttt.com/docs/applets#applets-cookbook

// Applet that picks a random color for LIFX when the Widget button is pressed

// Trigger: Button widget -> Button Press
// 					DoButton.doButtonNewCommandCommon.{ShareURL, Latitude, Longitude, LocationMapURL,
//																						 LocationMapImageURL, OccurredAt}
// Action:	LIFX -> Change color of lights
//					Lifx.color.{skip, setColorIfOff, setAdvancedOptions}

colors = ["#FF8400", "#FF0000", "#15FF00", "#FF00D4","#00D4FF","#003CFF"];
index = Math.floor((Math.random() * colors.length));
sink('Lifx.color', 'setAdvancedOptions', 'color: ' + colors[index] + '; brightness: 1; duration: 12');


