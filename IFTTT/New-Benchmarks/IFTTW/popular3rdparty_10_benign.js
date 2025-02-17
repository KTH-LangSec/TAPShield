// Title: Tweet your Facebook status updates
// Maker: djuiceman
// Link : https://ifttt.com/applets/1789p-tweet-your-facebook-status-updates

// Trigger: Facebook -> New status message by you
// Action : Twitter -> Post a tweet with image

// Policy/Presence: Confidentiality of status updates / No

msg = lbl("Facebook.newStatusMessageByYou.Message");
sink('Twitter.postNewTweetWithImage', 'setTweet', msg);
