// Title: Send yourself a Slack notification and an Email if a Trello card is added to a specific list
// Maker: ---
// Link : https://www.reddit.com/r/ifttt/comments/79jzqg/filter_code_trello_and_outlook/
// ======================
// Applet that sends a Slack notification and an Email if a Trello card is added to a specific list and it works perfectly.
// The card contains the "US" string in its code.

// Trigger: Trello -> Card added to list
// Action : Slack -> Post to channel
// Action : Email -> Send me an email

// Policy/Presence: Confidentiality of card data / No

title = lbl('Trello.cardAddedToList.Title');
cardTitle = title;
matchingCard = cardTitle.search("US");
if (matchingCard == -1) {
  skip('Slack.postToChannel');
	}
else {
	sink('Email.sendMeEmail', 'setBody', "An US card has been added to the list.");
	}
