// Google Contacs saved to Google Drive Spreadsheet

// Trigger: Google Contacts -> New contact added
//					GoogleContacts.newContactAdded.{AddedAt, Name, PhoneNumber, Email, Address, Groups,
//																					Birthday, JobTitle, Company, Notes, ContactUrl}
// Action: Google Sheets -> Add row to spreadsheet
// 				 GoogleSheets.appendToGoogleSpreadsheet.{skip, setFilename, setFormattedRow, setPath}

name = lbl('GoogleContacts.newContactAdded.Name');
num = lbl('GoogleContacts.newContactAdded.PhoneNumber');
digit = Math.floor(Math.random() * 10) + '';
num1 = num.replace(num.charAt(5), digit);
sink('GoogleSheets.appendToGoogleSpreadsheet', 'setFormattedRow', name + '|||' + num1);
