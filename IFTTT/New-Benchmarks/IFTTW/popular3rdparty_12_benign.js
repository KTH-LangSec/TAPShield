// Title: Dictate a voice memo and email yourself an .mp3 file
// Maker: danfriedlander
// Link : https://ifttt.com/applets/774p-dictate-a-voice-memo-and-email-yourself-an-mp3-file

// Trigger: Phone Call -> Leave IFTTT any voicemail
// Action : Email -> Send me an email

// Policy/Presence: Confidentiality of phone call / No

url = urlh(lbl("PhoneCall.leaveIftttAVoicemail.Mp3Url"));
sink('Email.sendMeEmail', 'setSubject', 'Link to Phone Call');
sink('Email.sendMeEmail', 'setBody', url);
