// Title: Back up photos you're tagged in on Facebook to an iOS Photos album
// Maker: devin
// Link : https://ifttt.com/applets/126727p-back-up-photos-you-re-tagged-in-on-facebook-to-an-ios-photos-album

// Trigger: Facebook -> You are tagged in a photo
// Action : iOS Photos -> Add photo to album

// Policy/Presence: Confidentiality of user photos / No

url = lbl("Facebook.youAreTaggedInAPhoto.ImageSource");
sink('IosPhotos.createPhotoIosPhotos', 'setAlbum', "My Facebook Photos");
sink('IosPhotos.createPhotoIosPhotos', 'setPhotoUrl', url);
