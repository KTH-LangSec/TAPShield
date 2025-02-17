// Title: Track your work hours in Google Calendar
// Maker: rothgar
// Link : https://ifttt.com/applets/133380p-track-your-work-hours-in-google-calendar

// Trigger: Location -> You enter or exit an area
// Action : Google Calendar -> Quick add event

// Policy/Presence: Confidentiality of location / Yes

when = 'Location.enterOrExitRegionLocation.OccurredAt';
what = 'Location.enterOrExitRegionLocation.EnteredOrExited';
sink('GoogleCalendar.quickAddEvent', 'setQuickAdd', when + ": I " +  what + " the office");
