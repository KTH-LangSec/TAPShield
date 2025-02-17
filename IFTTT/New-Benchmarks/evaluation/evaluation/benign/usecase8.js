// https://ifttt.com/applets/gqvGwQ79-sample-filter-code-to-calculate-the-duration-of-a-new-google-calendar-event

// IFTTT Filter Code to Calculate the Duration for a Google Calendar Event

// Paste the code below into the filter code box when making an applet on platform.ifttt.com. It should work as is if your trigger service is Google Calendar and your action service is the iOS Calendar (this assumes Google Calendar, iOS, and IFTTT haven't changed somehow).
// 
// The code calculates the duration of a Google Calendar event so an applet has it when creating a new iOS Calendar entry. It also sets the starting time for all-day events.
// 
// Due to limitations in IFTTT's calendar services, filter code cannot do the following:
// 
// - Determine if a Google Calendar event repeats
// - Set the iOS All-Day event flag (Google All-Day events are therefore created in iOS as 24-hour events from midnight to midnight)

//
// If 'at' found, then the entry has both date and time.
//    Events flagged as all-day events don't have times.
//
var wheresAt = GoogleCalendar.newEventGcal.Starts.search(" at ");
//
// If no ' at ', then it is an all-day or multi-all-day event.
//
if (wheresAt == -1) {
  var startDate = GoogleCalendar.newEventGcal.Starts;
  var startTime = "12:00AM";
  var endDate   = GoogleCalendar.newEventGcal.Ends;
  var endTime   = "12:00AM";
  var setStart  = GoogleCalendar.newEventGcal.Starts+ " at "+ startTime;
} 
//
// If 'at', then start and end dates have a time component
//
else {
  var startArray = GoogleCalendar.newEventGcal.Starts.split(" at ");
  var startDate  = startArray[0];
  var startTime  = startArray[1];
  var endArray   = GoogleCalendar.newEventGcal.Ends.split(" at ");
  var endDate    = endArray[0];
  var endTime    = endArray[1];
  var setStart  = GoogleCalendar.newEventGcal.Starts;
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
