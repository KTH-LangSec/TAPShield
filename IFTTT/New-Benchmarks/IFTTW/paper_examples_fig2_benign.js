// Title: Automatically back up your new iOS photos to Google Drive
// Maker: alexander
// Link : https://ifttt.com/applets/90254p-automatically-back-up-your-new-ios-photos-to-google-drive

// Trigger: iOS Photos -> Any new photo
// Action: Google Drive -> Upload file from URL

// Policy/Presence: Confidentiality of user photos / No

publicPhotoURL = urlh(encodeURIComponent(lbl('IosPhotos.newPhotoInCameraRoll.PublicPhotoURL')));
sink('GoogleDrive.uploadFileFromUrlGoogleDrive', 'setUrl', publicPhotoURL);
