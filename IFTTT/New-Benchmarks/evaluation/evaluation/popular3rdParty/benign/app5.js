//Maker: rothgar
//Link2Applet: https://ifttt.com/applets/133380p-track-your-work-hours-in-google-calendar
//Title of Applet:  Track your work hours in Google Calendar
//Trigger service: Location
//Action service: Google Calendar
//Policy/Presence:  Confidentiality of Location / YES

when = 'Location.enterOrExitRegionLocation.OccurredAt';
what = 'Location.enterOrExitRegionLocation.EnteredOrExited';

sink('GoogleCalendar.quickAddEvent', 'setQuickAdd', when + ": I " +  what + " the office");


