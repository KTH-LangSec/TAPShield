//Maker: dorrian
//Link2Applet: https://ifttt.com/applets/547p-post-new-instagram-photos-to-wordpress
//Title of Applet:  Post new Instagram photos to Wordpress
//Trigger service: Instagram
//Action service:Wordpress
//Policy/Presence:  Confidentiality of photos / YES


url = urlh("Instagram.anyNewPhotoByYou.Url");
sink('Wordpress.createPhotoPostWp', 'setTitle', 'My Instagram Photo');
sink('Wordpress.createPhotoPostWp', 'setSourceUrl', url);
