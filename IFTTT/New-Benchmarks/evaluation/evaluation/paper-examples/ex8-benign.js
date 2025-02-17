// Get an email alert when your kids come home and connect to Almond

// Trigger: Almond -> A device has connected
//					Almond.deviceConnected.{DeviceName, AlmondName, Timestamp}
// Action:  Email -> Send me an email
//				  Email.sendMeEmail.{skip, setSubject, setBody}

sink('Email.sendMeEmail', 'setBody', 'Your kids got home');
