// Filter code in Example 6.1
// Maker: ---
// Link : ---
// ======================
// Applet that sends an email with the map of the Uber ride

// Trigger: Uber -> Ride completed
// Action: Email -> Send me an email

// Policy/Presence: Confidentiality of Uber drive data / No

rideMap = lbl('Uber.rideCompleted.TripMapImage');
sink('Email.sendMeEmail', 'setBody', rideMap);
