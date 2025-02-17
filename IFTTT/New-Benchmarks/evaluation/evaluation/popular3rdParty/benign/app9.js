//Maker: ktavangari
//Link2Applet:  https://ifttt.com/applets/133495p-log-how-much-time-you-spend-at-home-work-etc
//Title of Applet:  Log how much time you spend at home/work/etc. 
//Trigger service: Location 
//Action service: Google Sheets
//Policy/Presence:  Confidentiality of Location / YES

when = 'Location.enterOrExitRegionLocation.OccurredAt';
what = 'Location.enterOrExitRegionLocation.EnteredOrExited';
where = 'Location.enterOrExitRegionLocation.LocationMapUrl';

sink('GoogleSheets.appendToGoogleSpreadsheet', 'setFilename', 'Time at location');
sink('GoogleSheets.appendToGoogleSpreadsheet', 'setFormattedRow', what + ' ||| '+ when + ' ||| ' + where);


