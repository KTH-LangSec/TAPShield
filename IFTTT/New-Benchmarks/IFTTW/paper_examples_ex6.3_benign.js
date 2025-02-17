// Filter code in Example 6.3
// Maker: ---
// Link : ---

// Trigger: ---
// Action: ---

// Policy/Presence: Confidentiality of trigger data / Yes

amount = 'Stripe.newPayment.Amount';
n = parseInt(amount);
while (n > 0) {
	n--;
}
sink('GoogleSheets.appendToGoogleSpreadsheet', 'setFormattedRow', 'New Stripe payment ' + amount);
