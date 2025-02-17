//Maker: anticipate
//Link2Applet: https://ifttt.com/applets/184936p-turn-your-lights-to-red-if-your-nest-protect-detects-a-carbon-monoxide-emergency
//Title of Applet:  Turn your lights to red if your Nest Protect detects a carbon monoxide emergency
//Trigger service: Nest Protect
//Action service: Philips Hue
//Policy/Presence: Availability / NO




status = lbl("NestProtect.coAlarmEmergency.CarbonMonoxideStatus");

if (status > 100) { sink('Hue.setColorAllHue', 'setColor', 'RED'); }
else { skip('Hue.setColorAllHue') }



