//Maker: skausky
//Link2Applet: https://ifttt.com/applets/67655p-while-i-m-not-home-let-me-know-if-any-motion-is-detected-in-my-house
//Title of Applet:  While I'm not home, let me know if any motion is detected in my house.
//Trigger service: WeMo Motion
//Action service: Notifications
//Policy/Presence:  Availability / NO



if ('WemoMotion.attributeMOTIONG.CreatedAt') { 
	sink('IfNotifications.sendNotification', 'setMessage', 'Motion Detected'); }
else { 	skip('IfNotifications.sendNotification');	}
