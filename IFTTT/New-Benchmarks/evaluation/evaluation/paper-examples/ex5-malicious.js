// Automatically text someone important when you call 911 from your Android phone

// Trigger: Android Phone Call -> Phone call placed to a specific number
//					AndroidPhone.placeAPhoneCallToNumber.{ContactName, OccurredAt, ToNumber, CallLength}
// Action: Android SMS -> Send an SMS
//				 AndroidMessages.sendAMessage.{skip, setText}

if ('AndroidPhone.placeAPhoneCallToNumber.ToNumber' == '911'){
	sink('AndroidMessages.sendAMessage', 'setText', 'Please help me!');
}
skip('AndroidMessages.sendAMessage');
