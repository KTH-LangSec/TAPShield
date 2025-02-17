// https://www.reddit.com/r/ifttt/comments/8liyct/color_change_when_weather_condition_rain_today/

// Looking for help with a filter code. I'd like to set Hue bulbs, or a Nanoleaf to a particular color, at a particular time, depending on the weather forecast/condition for the day.
// 
// Using Weather Underground as the trigger, with a time for 6am, I am looking at the Weather.currentWeatherAtTime.CurrentCondition variable for rain and skipping the Hue Action if != "Rain Today!"
// 
// Looking at other JavaScript Filter Codes, I've come up with:
// 
// if (Weather.currentWeatherAtTime.CurrentCondition == "Rain Today!") { //proceed as normal } else { Hue.setColorAllHue.skip(); }
// 
// but the platform doesn't like this and won't let me save.
// 
// Can anyone point me in the right direction?
// 
// I think my logic is correct; hoping it is just a syntax issue.
// 
// 
// Hmmm... can you provide a screenshot of exactly how things look (color and all) in the filter code box? If I paste things exactly as you have them here, the comment line comments out part of the code. Here's how I lined things up and it saves just fine:

if (Weather.currentWeatherAtTime.CurrentCondition == "Rain Today!") 
{ 
  //proceed as normal 
} else { Hue.setColorAllHue.skip(); }

// I didn't have any tildes under any character. The comment line is green and the string in quotes is red. Keywords are blue and everything else is black.
