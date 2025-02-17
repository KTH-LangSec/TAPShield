// https://www.reddit.com/r/ifttt/comments/79jzqg/filter_code_trello_and_outlook/

// Hi guys,
// 
// What is working well
// 
// I'm not familiar with coding but we currently have an applet set up to notify us on slack if a card is added to a specific list and it works perfectly.
// 
// What I need help with
// 
// We'd like to use a filter code to take an action (outlook email as i see you can connect outlook) if a card name contains a specific code. EG. AU or US.
// 
// Ideally i'd like it to recognise that a code is used (it won't be the full name of the card), added to a specific list, then if it sees that code, send a templated email to a pre-existing email.
// 
// In a best case scenario, we could use multiple codes and multiple email addresses.
// 
// E.g. If code contains AU = email john@gmail.com If codes contains US = email doe@gmail.com
// 
// Is it possible to match a code and send an email? Is it possible to contain multiple if conditions for multiple codes like the AU and US example above?
// 
// Thanks in advance for any help here!


// if "test" found, then true
var matchingCard = Trello.cardAddedToList.Title.search("test");
// if no, then execute skip
if (matchingCard == -1) {
  Slack.postToChannel.skip();
}
// if found then execute email

// I'll have to set this up with multiple applets, but we have a solution!
