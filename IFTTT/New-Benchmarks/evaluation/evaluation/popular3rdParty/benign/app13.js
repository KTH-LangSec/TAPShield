//Maker: sharonwu0220
//Link2Applet: https://ifttt.com/applets/416035p-if-arlo-detects-motion-call-my-phone
//Title of Applet:  If Arlo detects motion, call my phone
//Trigger service: Arlo
//Action service: Phone Call
//Policy/Presence:  Availability / NO


sink('PhoneCall.callMyPhone', 'setMessage', 'Motion Detected');


