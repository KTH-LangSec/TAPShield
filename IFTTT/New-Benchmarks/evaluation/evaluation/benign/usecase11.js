// https://ifttt.com/applets/nUBxy47v-ios-sample-ifttt-filter-code-to-build-a-url-scheme-for-the-workflow-app

// IFTTT Filter Code to Build a URL Scheme for the Workflow app

// Paste the code below into the filter code box when making an applet. It should work if (1) your trigger is the Gmail service's "new email in inbox from search" and (2) the action is Notifications "Send a rich notification from the IFTTT app" (this assumes IFTTT hasn't changed somehow).
// 
// This code builds the URL scheme for the iOS Workflow app. It includes the workflow name and text input. By default the text input is a single string made from the IFTTT ingredients for the email Subject and BodyPlain. The two ingredients are separated by '||'.
// 
// Here is an applet that uses this filter code.
// 
// Sample code:
// 
// 
// Change any of the following to match your preferences:
//    myWorkflow - the name of a workflow. The workflow must exist
//        before this applet runs.
//    ingredientSeparator - If you plan to send multilpe IFTTT 
//        ingredients to the workflow, you can use this as a 
//        unique character string to separate them.
//    workflowURL - the iOS Workflow scheme for your workflow. Put
//        IFTTT ingredients after "text=" in encodeURIComponent(). 
//        They are shown as part of a template literal in this sample
//        and have the format ${ingredient name}
//    setTitle() - the rich notification's bold text.
//    setMessage - the rich notifiction's second line of text.
//
const myWorkflow = `Gmail New Email`;
const subjectBodySeparator = `||`;
const workflowURL = encodeURI(`workflow://run-workflow?name=${myWorkflow}&input=text&text=`) + encodeURIComponent(`${Gmail.newEmailSimpleSearch.Subject}${subjectBodySeparator}${Gmail.newEmailSimpleSearch.BodyPlain}`);
IfNotifications.sendRichNotification.setTitle(`Tap to run "${myWorkflow}"`);
IfNotifications.sendRichNotification.setMessage(`The email’s subject and body will be passed unformatted to the workflow.`);
IfNotifications.sendRichNotification.setLinkUrl(workflowURL);
