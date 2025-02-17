// Title: Save photos you’re tagged in on Facebook to a Dropbox folder
// Maker: pavelbinar
// Link : https://ifttt.com/applets/15p-save-photos-you-re-tagged-in-on-facebook-to-a-dropbox-folder

// Trigger: Facebook -> You are tagged in a photo
// Action : Dropbox -> Add file from URL 

// Policy/Presence: Confidentiality of user photos / No

url = lbl("Facebook.youAreTaggedInAPhoto.ImageSource");
sink('Dropbox.addFileFromUrl', 'setFilename', 'My Facebook Photos');
sink('Dropbox.addFileFromUrl', 'setUrl', url);
