// IFTTT filter code to do 'That' during a time range 

// Copy and paste the code below into the filter code box when making an applet on platform.ifttt.com. No, you really don't need all the code here, but it doesn't hurt to paste it all into box. Just read the comments and modify if necessary.

// Change startTime and stopTime to set the time range when you want 
//     your service's action (the 'That') to happen:
//
//    var startTime = moment('01:00 pm', "HH:mm a");
//    var stopTime  = moment('11:00 am', "HH:mm a");
// 
// startTime is the first time when the action can happen
// stopTime  is the last time the action can happen... until time
//    reaches the next startTime.
//
// Notes:
//   - startTime can be later than stopTime. For example, startTime
//        can be 10:00pm and stopTime 06:00am. This means actions can
//        happen from 10pm of one day until 6am of the next day but
//        not between 6am and 10pm of either day.
//
//   - startTime cannot be the same as stopTime
//
//   - 'Skip' messages are written when the service's action does not
//        happen, such as after the stopTime and before the next
//        start time.
//
//   - If you want to use this code with a service other than
//        Gmail.sendYourselfAnEmail, you must change the lines that
//        reference Gmail.sendYourselfAnEmail.skip to the skip method
//        for your service.
//
// --------------------------
//
// The code converts everything to minutes for comparision purposes
//
   var startTimeMinutes = startTime.minutes() + startTime.hours() * 60;
   var stopTimeMinutes  = stopTime.minutes()  + stopTime.hours()  * 60;
   var triggerTimeMinutes = Meta.triggerTime.minutes() + Meta.triggerTime.hours()* 60;
//
// StartTime = stopTime not allowed.
//
   if (startTimeMinutes == stopTimeMinutes) 
   {
     Gmail.sendYourselfAnEmail.skip("Start and end times cannot be the same - start is "+startTime.format('LT')+" and end time is "+stopTime.format('LT'));
   } else { 
//
// Set some defaults... 
//
     var doThat = new Boolean(false);
     var whatsup  = "'That' has been skipped";
//
// If start time is less than stop time, then the range is assumed to
//   be a continuous period during a single day. E.g., 9am-6pm. 
//
     if ((startTimeMinutes<stopTimeMinutes) 
            && (triggerTimeMinutes >= startTimeMinutes 
             && triggerTimeMinutes <= stopTimeMinutes)) 
     {
       doThat = Boolean(true);
       whatsup  = "range within a single day";
     }
//
// If start time > stop time, then the range is assumed to span
//   midnight (12am). E.g. 10pm-6am. This range covers parts of two 
//   days.
//
     else if ((startTimeMinutes>stopTimeMinutes) 
           && (triggerTimeMinutes > startTimeMinutes 
            || triggerTimeMinutes < stopTimeMinutes)) 
     {
       doThat = Boolean(true);
       whatsup  = "range spans midnight";
     }
//
// Out of range... 
//
    if (doThat == false) 
    {  
      Gmail.sendYourselfAnEmail.skip("Event happened outside time range (" + whatsup +") - time of trigger was "+Meta.triggerTime.format('LT')+", but start time to allow the action is "+ startTime.format('LT') + " and stop time is "+ stopTime.format('LT') + " Debug info: minutes are "+triggerTimeMinutes + " " + startTimeMinutes + " " + stopTimeMinutes);
    }
//
// The following code can be uncommented for debugging. It writes
//    an entry to the activity log instead of performing the 
//    action.
//
//   else {
//     Gmail.sendYourselfAnEmail.skip("Action can happen (" + whatsup +") - time of trigger was "+Meta.triggerTime.format('LT')+", start time is "+ startTime.format('LT') + ", and stop time is "+ stopTime.format('LT') + ". Debug info: Minutes are trigger="+triggerTimeMinutes + ", start=" + startTimeMinutes + ", and stop=" + stopTimeMinutes);
//   }
 }
