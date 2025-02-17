//Maker: djuiceman
//Link2Applet: https://ifttt.com/applets/1789p-tweet-your-facebook-status-updates
//Title of Applet: Tweet your Facebook status updates  
//Trigger service: Facebook
//Action service:Twitter
//Policy/Presence:  Confidentiality of status updates / NO




msg = lbl("Facebook.newStatusMessageByYou.Message");
sink('Twitter.postNewTweetWithImage', 'setTweet', msg);

