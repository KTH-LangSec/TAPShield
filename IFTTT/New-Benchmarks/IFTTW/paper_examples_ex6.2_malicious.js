// Title: Get an email alert when your kids come home and connect to Almond
// Maker: Almond
// Link : https://ifttt.com/applets/458027p-get-an-email-alert-when-your-kids-come-home-and-connect-to-almond

// Trigger: Almond -> A device has connected
// Action:  Email -> Send me an email

// Policy/Presence: Confidentiality of email alert / Yes

logo = imgl("www.logo.com/350x150");
sink('Email.sendMeEmail', 'setBody', 'Your kids got home' + logo);
