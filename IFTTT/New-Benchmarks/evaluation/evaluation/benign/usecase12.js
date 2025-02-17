// https://ifttt.com/applets/B6defMmr-sample-ifttt-filter-code-to-uri-encode-a-url

// IFTTT Filter Code to URI Encode a URL


// Paste the code below into the filter code box when making an applet. It should work if (1) Note Widget is the trigger and (2) Notifications "Send a rich notification from the IFTTT app" is the action (this assumes IFTTT hasn't changed somehow).
// 
// This code builds the URL for a Google site search of IFTTT using the Note Widget's text as search parameters. It uses the encodeURI() function with the URL but you can easily change it to use encodeURIcomponent() in addition to encodeURI().
// 
// Here is an applet that uses this filter code.
// 
// Sample code:

var googleSearchLink = encodeURI("https://www.google.com/search?q=site:ifttt.com/applets+" + DoNote.doNoteNewCommandCommon.NoteText);
IfNotifications.sendRichNotification.setMessage(googleSearchLink);
IfNotifications.sendRichNotification.setLinkUrl(googleSearchLink);
