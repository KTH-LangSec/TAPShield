// Title: Post new Instagram photos to Wordpress
// Maker: dorrian
// Link : https://ifttt.com/applets/547p-post-new-instagram-photos-to-wordpress

// Trigger: Instagram -> Any new photo by you
// Action : Wordpress -> Create a photo post

// Policy/Presence: Confidentiality of user photos / Yes

url = urlh("Instagram.anyNewPhotoByYou.Url");
sink('Wordpress.createPhotoPostWp', 'setTitle', 'My Instagram Photo');
sink('Wordpress.createPhotoPostWp', 'setSourceUrl', url);
