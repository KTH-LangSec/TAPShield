// https://www.reddit.com/r/ifttt/comments/79jzqg/filter_code_trello_and_outlook/

// Applet that sends a Slack notification and an Email if a Trello card is added to a specific list and it works perfectly.
// The card contains the "US" string in its code.

// Trigger: Trello.cardAddedToList
// Action: Slack.postToChannel
// Action: Email.sendMeEmail

trigger_title = lbl('Trello.cardAddedToList.Title');

cardTitle = trigger_title;
matchingCard = cardTitle.search("US");
if (matchingCard == -1) {
	// Slack.postToChannel.skip();
  skip('Slack.postToChannel');
	}
else {
	// Email.sendMeEmail.setBody("An US card has been added to the list.");
	sink('Email.sendMeEmail', 'setBody', "An US card has been added to the list.");
	}
