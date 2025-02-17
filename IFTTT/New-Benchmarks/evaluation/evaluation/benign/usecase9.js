// IFTTT Filter Code to Calculate the Duration of a Google Calendar Event (v2)

// Paste the code below into the filter code box when making an applet. It should work if Google Calendar "new event added" is the trigger and iOS Calendar is the action (this assumes IFTTT hasn't changed somehow).
// 
// The code calculates the duration of a Google Calendar event in minutes so that an applet has it when creating a new iOS Calendar entry.
// 
// Due to limitations in IFTTT's calendar services, filter code cannot do the following:
// 
// - Determine if a Google Calendar event repeats
// - Set the iOS All-Day event flag (Google All-Day events are therefore created in iOS as 24-hour events from midnight to midnight)

//
// If 'at' found, then the entry has both date and time.
//    Events flagged as all-day events don't usually have times.
//
var wheresAt = GoogleCalendar.newEventAdded.Starts.search(" at ");
//
// If no ' at ', then it is an all-day or multi-all-day event.
//
if (wheresAt == -1) {
  var startDate = GoogleCalendar.newEventAdded.Starts;
  var startTime = "12:00AM";
  var endDate   = GoogleCalendar.newEventAdded.Ends;
  var endTime   = "12:00AM";
  var setStart  = GoogleCalendar.newEventAdded.Starts+ " at "+ startTime;
} 
//
// If 'at', then start and end dates have a time component
//
else {
  var startArray = GoogleCalendar.newEventAdded.Starts.split(" at ");
  var startDate  = startArray[0];
  var startTime  = startArray[1];
  var endArray   = GoogleCalendar.newEventAdded.Ends.split(" at ");
  var endDate    = endArray[0];
  var endTime    = endArray[1];
  var setStart  = GoogleCalendar.newEventAdded.Starts;
}
//
// IFTTT's dates are not in a standard format, so they must be
//    converted because we need to do the math to determine the
//    duration in minutes as required by the iOS calendar.
//
if (startTime.search("PM") == -1) {
  var fullStartTime = new Date(startDate + " " + startTime.substr(0,5) + " AM");
} else {
  var fullStartTime = new Date(startDate + " " + startTime.substr(0,5) + " PM");
}

if (endTime.search("PM") == -1) {
  var fullEndTime = new Date(endDate + " " + endTime.substr(0,5) + " AM");
} else {
  var fullEndTime = new Date(endDate + " " + endTime.substr(0,5) + " PM");
}

var fullDiffInMs = fullEndTime.getTime()-fullStartTime.getTime();
var msPerMin  = 1000 * 60;
var iOSduration = fullDiffInMs/msPerMin;
//
// Set the duration and start time. 
//    All other values come from the base applet.
//
var durationAsString = iOSduration.toString();
IosCalendar.createCalendarEvent.setDuration(durationAsString);
IosCalendar.createCalendarEvent.setStartDate(setStart);
