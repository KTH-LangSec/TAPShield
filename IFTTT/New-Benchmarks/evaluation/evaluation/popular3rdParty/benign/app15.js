//Maker: apurvjoshi
//Link2Applet: https://ifttt.com/applets/386864p-get-a-phone-call-when-nest-cam-detects-motion
//Title of Applet:  Get a phone call when Nest cam detects motion
//Trigger service: Nest Cam
//Action service: Phone Call
//Policy/Presence:  Availability



status = lbl("NestCam.motionEvent.StartedAt");
if (status) { sink('PhoneCall.callMyPhone', 'setMessage', '') }
else { skip('PhoneCall.callMyPhone');}
