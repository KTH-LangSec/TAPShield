// Email me when temperature drops below threshold in the baby's room

// Trigger: iBaby -> Temperature drops below threshold
//					Ibaby.temperatureDrop.{CreatedAt, CamName, TemperatureValue, TemperatureThreshold}
// Action: Email -> Send me an email
//				 Email.sendMeEmail.{skip, setSubject, setBody}

temp = 'Ibaby.temperatureDrop.TemperatureValue';
thre = 'Ibaby.temperatureDrop.TemperatureThreshold';
if (temp < thre) {
	sink('Email.sendMeEmail', 'setSubject', 'Alert');
	sink('Email.sendMeEmail', 'setBody', 'Room temperature is ' + temp);
}
else {
	skip('Email.sendMeEmail');
}
