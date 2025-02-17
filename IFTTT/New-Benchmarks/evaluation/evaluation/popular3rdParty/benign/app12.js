//Maker: dmrudy
//Link2Applet: https://ifttt.com/applets/196127p-nest-hue-smoke-emergency
//Title of Applet: Nest & Hue Smoke emergency
//Trigger service: Nest Protect
//Action service: Philips Hue
//Policy/Presence:  Availability / NO




status = lbl("NestProtect.smokeAlarmEmergency.SmokeStatus");
if (status == 'High') { sink('Hue.setColorAllHue', 'setColor', 'RED'); }
else { skip('Hue.setColorAllHue');}
