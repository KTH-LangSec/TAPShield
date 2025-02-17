// Title: Send a notification from IFTTT with the result of a Google query
// Maker: hairfollicle12
// Link : https://ifttt.com/applets/B6defMmr-sample-ifttt-filter-code-to-uri-encode-a-url

// Trigger: Note widget -> Any new note
// Action: Notifications -> Send a rich notification from the IFTTT app
		
// Policy/Presence: Confidentiality of user location / No

trigger_noteText = lbl('DoNote.doNoteNewCommandCommon.NoteText');
googleSearchLink = encodeURI(urlh("https://www.google.com/search?q=site:ifttt.com/applets+" + trigger_noteText));
sink('IfNotifications.sendRichNotification', 'setMessage', googleSearchLink);
sink('IfNotifications.sendRichNotification', 'setLinkUrl', googleSearchLink);
