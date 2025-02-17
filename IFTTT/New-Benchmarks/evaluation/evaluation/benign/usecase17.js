// Example: Daily motivational quote
// Applet description
// 
//     Daily quote
//     Receive a daily motivational quote on your phone and a weekly digest with all the quotes.
// 
// Trigger
// 
//     Date & Time: Everyday at a time chosen by the user
// 
// Filter code

// quotes by brainyquote.com
var data = [{"quote":"Life is 10% what happens to you and 90% how you react to it.","author":"Charles R. Swindoll"},{"quote":"Only I can change my life. No one can do it for me.","author":"Carol Burnett"},{"quote":"Infuse your life with action. Don't wait for it to happen. Make it happen. Make your own future. Make your own hope. Make your own love. And whatever your beliefs, honor your creator, not by passively waiting for grace to come down from upon high, but by doing what you can to make grace happen... yourself, right now, right down here on Earth.","author":"Bradley Whitford"},{"quote":"Optimism is the faith that leads to achievement. Nothing can be done without hope and confidence.","author":"Helen Keller"}]

var day  = Meta.currentTime.day()
var wday = Meta.currentTime.format('dddd')
var msg  = data[day]['quote'] + 'by ' + data[day]['author']

IfNotifications.sendNotification.setMessage(msg)
EmailDigest.sendWeeklyEmail.setTitle(wday)
EmailDigest.sendWeeklyEmail.setMessage(msg)

// Action(s)
// 
//     Notifications: Send notification
//     Email Digest: Add to weekly email digest
