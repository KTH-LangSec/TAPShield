// Title: Keep a list of notes to email yourself at the end of the day
// Maker: Google
// Link : https://ifttt.com/applets/479449p-keep-a-list-of-notes-to-email-yourself-at-the-end-of-the-day

// Trigger: Google Assistant -> Say a phrase with a text ingredient
// Action: Email Digest -> Add to email digest

// Policy/Presence: Confidentiality of user notes / No

notes = urlh(encodeURIComponent(lbl('GoogleAssistant.voiceTriggerWithOneTextIngredient.TextField')));
sink('EmailDigest.sendDailyEmail', 'setMessage', 'Notes of the day ' + notes);
