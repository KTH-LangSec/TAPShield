//Maker: djuiceman
//Link2Applet: https://ifttt.com/applets/103249p-tweet-your-instagrams-as-native-photos-on-twitter
//Title of Applet:  Tweet your Instagrams as native photos on Twitter
//Trigger service: Instagram
//Action service: Twitter
//Policy/Presence: Confidentiality of user Photos / NO 


url = lbl("Instagram.anyNewPhotoByYou.Url");
sink('Twitter.postNewTweetWithImage', 'setTweet', 'My Instagram Photo');
sink('Twitter.postNewTweetWithImage', 'setPhotoUrl', url);

