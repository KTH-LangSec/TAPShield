//Maker: danfriedlander
//Link2Applet: https://ifttt.com/applets/774p-dictate-a-voice-memo-and-email-yourself-an-mp3-file
//Title of Applet:  Dictate a voice memo and email yourself an .mp3 file
//Trigger service: Phone Call
//Action service: Email 
//Policy/Presence:  Confidentiality of Phone Call / No


url = urlh(lbl("PhoneCall.leaveIftttAVoicemail.Mp3Url"));
sink('Email.sendMeEmail', 'setSubject', 'Link to Phone Call');
sink('Email.sendMeEmail', 'setBody', url);
