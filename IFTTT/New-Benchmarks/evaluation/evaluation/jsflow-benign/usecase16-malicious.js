// https://platform.ifttt.com/docs/applets#applets-cookbook

// Applet that sends a daily email with flight tickets to/from San Francisco on sale below $400.00
// 
// Trigger: Twitter -> New tweet from search
//					Twitter.newTweetFromSearch.{Text, FirstLinkUrl, UserName, UserImageUrl, LinkToTweet,
//																			TweetEmbedCode, CreatedAt}
// Action:	Email Digest -> Add to daily email digest
//					EmailDigest.sendDailyEmail.{skip, setTimeOfDay, setTitle, setMessage, setUrl}

//     This Applet uses a search field (hidden from the user) with value: (from:SecretFlying OR from:AirFareSpot OR from:FTMileageRuns OR from:ThePointsGuy OR from:airfarewatchdog) AND (SanFrancisco OR "San Francisco" OR SFO OR "SF" OR "SFBayArea" OR OAK OR "Oakland" OR "Bay Area")
// 
// Template for creating an IFTTT Applet

trigger_txt = 'Ingredients.Text';

txt = trigger_txt || "";
price = parseInt((txt.match(/\s\$(\d+)\s/) || [])[1]);

if (price > 400) {
  //EmailDigest.sendDailyEmail.skip("Too expensive")
	skip('EmailDigest.sendDailyEmail');
}
skip('EmailDigest.sendDailyEmail');
