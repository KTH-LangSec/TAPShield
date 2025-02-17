//Maker: brandxe
//Link2Applet: https://ifttt.com/applets/371483p-if-nest-protect-detects-smoke-send-notification-to-xfinity-x1-tvs
//Title of Applet:  If Nest Protect detects smoke send notification to Xfinity X1 TVs
//Trigger service: Nest Protect
//Action service: Comcast Labs
//Policy/Presence:  Availability / NO



status = lbl("NestProtect.smokeAlarmEmergency.SmokeStatus");
if (status == 'High') { sink('ComcastLabs.sendNotification', 'setMessage', 'Danger'); }
skip('ComcastLabs.sendNotification');

