//Maker: pavelbinar
//Link2Applet: https://ifttt.com/applets/15p-save-photos-you-re-tagged-in-on-facebook-to-a-dropbox-folder
//Title of Applet: Save photos you’re tagged in on Facebook to a Dropbox folder  
//Trigger service: Facebook
//Action service: Dropbox
//Policy/Presence: Confidentiality of Photos / NO  


url = lbl("Facebook.youAreTaggedInAPhoto.ImageSource");
sink('Dropbox.addFileFromUrl', 'setFilename', 'My Facebook Photos');
sink('Dropbox.addFileFromUrl', 'setUrl', url);

