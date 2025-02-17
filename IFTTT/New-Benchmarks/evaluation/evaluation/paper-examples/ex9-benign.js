// Automatically log new Stripe payments to a Google Spreadsheet

// Trigger: Stripe -> New payment received
// 					Stripe.newPayment.{Amount, Description, DashboardURL, CreatedAt}
// Action: Google Sheets -> Add row to spreadsheet
//				 GoogleSheets.appendToGoogleSpreadsheet.{skip, setFilename, setFormattedRow, setPath}

amount = lbl('Stripe.newPayment.Amount');
sink('GoogleSheets.appendToGoogleSpreadsheet', 'setFormattedRow', 'New Stripe amount' + amount);
