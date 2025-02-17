// IFTTT filter code to identify Google Calendar all-day calendar events (v2)

// Paste the code below into the filter code box when making an applet. It should work if Google Calendar "new event added" is the trigger and Notifications is the action (this assumes IFTTT hasn't changed somehow).
// 
// If you want to use a different action, modify the code to replace the following methods with those from the action service you choose:
// 
// - IfNotifications.sendNotification.setMessage()
// - IfNotifications.sendNotification.skip()

//
// If 'at' found, then the entry has both date and time.
//    All-day events usually don't have times.
//
var wheresAt = GoogleCalendar.newEventAdded.Starts.search(" at ");
//
// If no 'at', then it is an all-day or multi-day event.
//
if (wheresAt == -1) {
  var startDate = new Date(GoogleCalendar.newEventAdded.Starts);
  var startTime = "not found";
  var endDate   = new Date(GoogleCalendar.newEventAdded.Ends);
  var endTime   = "not found";
}
//
// If 'at', then it has a time and should not be an all-day event
//
else {
  var startArray = GoogleCalendar.newEventAdded.Starts.split(" at ");
  var startDate  = new Date(startArray[0]);
  var startTime  = startArray[1];
  var endArray   = GoogleCalendar.newEventAdded.Ends.split(" at ");
  var endDate    = new Date(endArray[0]);
  var endTime    = endArray[1];
}
//
// Figure out how many days are involved.
//
var diffInMs = endDate.getTime()-startDate.getTime();
var msPerDay = 1000 * 60 * 60 * 24;
var diffInDays = diffInMs/msPerDay;
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
    IfNotifications.sendNotification.setMessage("Calendar: "+ diffInDays + "-day event added. It starts " + GoogleCalendar.newEventAdded.Starts + " and is titled \"" + GoogleCalendar.newEventAdded.Title  + "\".");
  }
}
//
//  It's possible for an all-day event to have a time.
//
else {
  if (diffInDays == 1 && startTime == endTime) {
    IfNotifications.sendNotification.setMessage("Calendar: 24-hour event added that starts " + GoogleCalendar.newEventAdded.Starts + ", ends " + GoogleCalendar.newEventAdded.Ends + ", and is titled \"" + GoogleCalendar.newEventAdded.Title  + "\".");
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
        IfNotifications.sendNotification.skip("Calendar: Skipping event because it is not an all-day event. It starts " + GoogleCalendar.newEventAdded.Starts + ", ends " + GoogleCalendar.newEventAdded.Ends + ", and is titled \"" + GoogleCalendar.newEventAdded.Title  + "\". Duration = " + diffInMin +" minutes.");
//
// Here's a message for all other froms of 24+ hour events.
//
      } else {
          IfNotifications.sendNotification.setMessage("Calendar: 24+ hour event added that starts " + GoogleCalendar.newEventAdded.Starts + ", ends " + GoogleCalendar.newEventAdded.Ends + ", and is titled \"" + GoogleCalendar.newEventAdded.Title  + "\".");
      }
  }
}
