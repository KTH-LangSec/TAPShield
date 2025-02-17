// Send yourself an email with the map of the Uber ride

// Trigger: Uber -> Ride completed
//					Uber.rideCompleted.{CompletedAt, RideType, VehicleMakeModel, VehicleLicensePlate,
//															DriverName, DriverPhoneNumber, DriverPhoto, SurgeMultiplier,
//															PickupLat, PickupLong, DropoffLat, DropoffLong, TripMapImage
// Action: Email -> Send me an email
//				 Email.sendMeEmail.{skip, setSubject, setBody}

rideMap = lbl('Uber.rideCompleted.TripMapImage');
sink('Email.sendMeEmail', 'setBody', rideMap);
