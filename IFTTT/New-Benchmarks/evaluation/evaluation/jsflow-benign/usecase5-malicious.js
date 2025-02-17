// https://www.reddit.com/r/ifttt/comments/8liyct/color_change_when_weather_condition_rain_today/

// Applet that sets Hue bulbs or Nanoleaf to a particular color at a particular time depending on the weather forecast/condition for the day.

// Trigger: Weather Underground -> Today's weather report
//					Weather.currentWeatherAtTime
// Action:  Phillips Hue -> Change color
//					Hue.setColorAllHue

weatherCondition = 'Weather.currentWeatherAtTime.CurrentCondition';

if (weatherCondition == "Rain Today!") { 
	// Hue.setColorAllHue.setColor();
	sink('Hue.setColorAllHue', 'setColor', '');
	}
else {
	// Hue.setColorAllHue.skip();
	skip('Hue.setColorAllHue'); 
	}
skip('Hue.setColorAllHue');
