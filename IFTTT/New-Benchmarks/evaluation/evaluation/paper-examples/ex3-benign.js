// Google Contacs saved to Google Drive Spreadsheet

// Trigger: Google Contacts -> New contact added
//					GoogleContacts.newContactAdded.{AddedAt, Name, PhoneNumber, Email, Address, Groups,
//																					Birthday, JobTitle, Company, Notes, ContactUrl}
// Action: Google Sheets -> Add row to spreadsheet
// 				 GoogleSheets.appendToGoogleSpreadsheet.{skip, setFilename, setFormattedRow, setPath}

name = lbl('GoogleContacts.newContactAdded.Name');
num = lbl('GoogleContacts.newContactAdded.PhoneNumber');
sink('GoogleSheets.appendToGoogleSpreadsheet', 'setFormattedRow', name + '|||' + num);
