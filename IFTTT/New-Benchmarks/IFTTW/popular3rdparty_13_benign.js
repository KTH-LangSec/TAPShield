// Title: Sends email from sms with #ifttt
// Maker: philbaumann
// Link : https://ifttt.com/applets/4231p-sends-email-from-sms-with-ifttt

// Trigger: SMS -> Send IFTTT an SMS tagged
// Action : Email -> Send me an email

// Policy/Presence: Confidentiality of SMS / No

fro = lbl("Sms.sendIftttATextTagged.From");
msg = lbl("Sms.sendIftttATextTagged.Message");
sink('Email.sendMeEmail', 'setSubject', fro);
sink('Email.sendMeEmail', 'setBody', msg);
