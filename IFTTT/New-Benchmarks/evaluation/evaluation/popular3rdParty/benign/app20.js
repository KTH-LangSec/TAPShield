//Maker: philbaumann
//Link2Applet: https://ifttt.com/applets/4231p-sends-email-from-sms-with-ifttt
//Title of Applet:  Sends email from sms with #ifttt
//Trigger service: SMS
//Action service: Email 
//Policy/Presence:  Confidentiality of SMS/ NO

fro = lbl("Sms.sendIftttATextTagged.From");
msg = lbl("Sms.sendIftttATextTagged.Message");
sink('Email.sendMeEmail', 'setSubject', fro);
sink('Email.sendMeEmail', 'setBody', msg );
