// Title: Log how much time you spend at home/work/etc.
// Maker: ktavangari
// Link : https://ifttt.com/applets/133495p-log-how-much-time-you-spend-at-home-work-etc

// Trigger: Location -> You enter or exit an area
// Action : Google Sheets -> Add row to spreadsheet

// Policy/Presence: Confidentiality of location / Yes

when = 'Location.enterOrExitRegionLocation.OccurredAt';
what = 'Location.enterOrExitRegionLocation.EnteredOrExited';
where = 'Location.enterOrExitRegionLocation.LocationMapUrl';
sink('GoogleSheets.appendToGoogleSpreadsheet', 'setFilename', 'Time at location');
sink('GoogleSheets.appendToGoogleSpreadsheet', 'setFormattedRow', what + ' ||| '+ when + ' ||| ' + where);
