// https://platform.ifttt.com/docs/applets#applets-cookbook

// Applet that sends a daily Notification with a motivational quote and a weekly digest with all the quotes

// Trigger: Date & Time -> Every day at
//					DateAndTime.everyDayAt.{CheckTime}
// Action:	Email Digest -> Add to weekly email digest
//					EmailDigest.sendWeeklyEmail.{skip, setTimeOfDay, setDayOfWeek, setTitle, setMessage,
//																			 setUrl}
// Action: 	Notifications -> Send a notification from the IFTTT app
//					IfNotifications.sendNotification.{skip, setMessage}


trigger_day  = 2 //'Meta.currentTime.day()';
trigger_wday = "Meta.currentTime.format('dddd')";

// quotes by brainyquote.com
data = [{"quote":"Life is 10% what happens to you and 90% how you react to it.","author":"Charles R. Swindoll"},{"quote":"Only I can change my life. No one can do it for me.","author":"Carol Burnett"},{"quote":"Infuse your life with action. Don't wait for it to happen. Make it happen. Make your own future. Make your own hope. Make your own love. And whatever your beliefs, honor your creator, not by passively waiting for grace to come down from upon high, but by doing what you can to make grace happen... yourself, right now, right down here on Earth.","author":"Bradley Whitford"},{"quote":"Optimism is the faith that leads to achievement. Nothing can be done without hope and confidence.","author":"Helen Keller"}];

day  = trigger_day;
wday = trigger_wday;
msg  = data[day]['quote'] + 'by ' + data[day]['author'];

sink('IfNotifications.sendNotification', 'setMessage', msg);
sink('EmailDigest.sendWeeklyEmail', 'setTitle', wday);
sink('EmailDigest.sendWeeklyEmail', 'setMessage', msg);

