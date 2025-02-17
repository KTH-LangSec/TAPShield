// Applet that sends a Notification when an all-day calendar event is added to Google Calendar

// Trigger: Google Calendar -> New event added
//				 	GoogleCalendar.newEventAdded.{Title, Description, Where, Starts, 
//																				Ends, EventUrl, VideoCallUrl, CreatedAt}
// Action: 	Notifications -> Send a notification from the IFTTT app
//					IfNotifications.sendNotification.{skip(), setMessage()}

trigger_starts = 'GoogleCalendar.newEventAdded.Starts';
trigger_ends = 'GoogleCalendar.newEventAdded.Ends';
trigger_title = 'GoogleCalendar.newEventAdded.Title';

wheresAt = trigger_starts.search(" at ");

startDate = '';
endDate = '';
startTime = '';
endTime = '';
fullStartTime = '';
fullEndTime = '';
setStart = '';
//
// If no 'at', then it is an all-day or multi-day event.
//
if (wheresAt == -1) {
  startDate = new Date(trigger_starts);
  startTime = "not found";
  endDate   = new Date(trigger_ends);
  endTime   = "not found";
}
//
// If 'at', then it has a time and should not be an all-day event
//
else {
  startArray = trigger_starts.split(" at ");
  startDate  = new Date(startArray[0]);
  startTime  = startArray[1];
  endArray   = trigger_ends.split(" at ");
  endDate    = new Date(endArray[0]);
  endTime    = endArray[1];
}
//
// Figure out how many days are involved.
//
diffInMs = endDate.getTime()-startDate.getTime();
msPerDay = 1000 * 60 * 60 * 24;
diffInDays = diffInMs/msPerDay;
//
// If no 'at', then you have at least one all-day event...
//
if (wheresAt == -1) {
//
// Multi-day events use the message below.
//    One-day events default to the action's notification text.
//
  if (diffInDays != 1) 
  {
		// IfNotifications.sendNotification.setMessage("Calendar: "+ diffInDays + "-day event added. It starts " + trigger_starts + " and is titled \"" + trigger_title  + "\".");
    sink('IfNotifications.sendNotification', 'setMessage', "Calendar: "+ diffInDays + "-day event added. It starts " + trigger_starts + " and is titled \"" + trigger_title  + "\".");
  }
}
//
//  It's possible for an all-day event to have a time.
//
else {
  if (diffInDays == 1 && startTime == endTime) {
		// IfNotifications.sendNotification.setMessage("Calendar: 24-hour event added that starts " + trigger_starts + ", ends " + trigger_ends + ", and is titled \"" + trigger_title  + "\".");
    sink('IfNotifications.sendNotification' , 'setMessage', "Calendar: 24-hour event added that starts " + trigger_starts + ", ends " + trigger_ends + ", and is titled \"" + trigger_title  + "\".");
  } else {
//
// IFTTT's date is not in a standard format, so they must
//    be converted so we can do a little math
//    to work with events that span midnight or are > 24 hours.
//
      if (startTime.search("PM") == -1) {
        var fullStartTime = new Date(startArray[0] + " " + startTime.substr(0,5) + " AM");
      } else {
        var fullStartTime = new Date(startArray[0] + " " + startTime.substr(0,5) + " PM");
      }
      if (endTime.search("PM") == -1) {
        var fullEndTime = new Date(endArray[0] + " " + endTime.substr(0,5) + " AM");
      } else {
        var fullEndTime = new Date(endArray[0] + " " + endTime.substr(0,5) + " PM");
      }
      var fullDiffInMs = fullEndTime.getTime()-fullStartTime.getTime();
      var msPerMin  = 1000 * 60;
      var diffInMin = fullDiffInMs/msPerMin;
      var minPerDay = 60 * 24;
//
// Now we can test for and skip any event < 24 hours long.
//
      if (diffInMin < minPerDay) {
 	       // IfNotifications.sendNotification.skip("Calendar: Skipping event because it is not an all-day event. It starts " + GoogleCalendar.newEventAdded.Starts + ", ends " + GoogleCalendar.newEventAdded.Ends + ", and is titled \"" + GoogleCalendar.newEventAdded.Title  + "\". Duration = " + diffInMin +" minutes.");
					skip('IfNotifications.sendNotification');
//
// Here's a message for all other froms of 24+ hour events.
//
      } else {
					// IfNotifications.sendNotification.setMessage("Calendar: 24+ hour event added that starts " + trigger_starts + ", ends " + trigger_ends + ", and is titled \"" + trigger_title + "\".");			
          sink('IfNotifications.sendNotification', 'setMessage', "Calendar: 24+ hour event added that starts " + trigger_starts + ", ends " + trigger_ends + ", and is titled \"" + trigger_title + "\".");
      }
  }
}
skip('IfNotifications.sendNotification');
