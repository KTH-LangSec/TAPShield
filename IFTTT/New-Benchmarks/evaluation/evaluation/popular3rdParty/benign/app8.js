//Maker: rsms
//Link2Applet: https://ifttt.com/applets/507p-automatically-share-your-instagrams-to-facebook
//Title of Applet:  Automatically share your Instagrams to Facebook
//Trigger service: Instagram
//Action service: Facebook
//Policy/Presence: Confidentiality of Instagram photos / NO  




url = lbl("Instagram.anyNewPhotoByYou.Url");
sink('FacebookPages.createPhotoPage', 'setPhotoUrl', url);

