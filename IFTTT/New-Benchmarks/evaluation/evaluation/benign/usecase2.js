// https://stackoverflow.com/questions/44249787/ifttt-filter-code-for-pinterest-rss-feed

// I am using IFTTT to post to Facebook page from pinterest RSS. Here is the url of RSS Feed - Link
// 
// What I want to do is replace all 236x string with 564x in the RSS feed result. As I am not a programmer I wrote this code to replace 236x with 564x in Javascript .
// 
// var url=Feed.newFeedItem.EntryImageUrl;
// var newurl=url.replace(/236x/g,'564x');



/*
You can use FacebookPages.createPhotoPage.setPhotoUrl() action to override the url field :*/

var url = Feed.newFeedItem.EntryImageUrl;
var newurl = url.replace(/236x/g,'564x');
FacebookPages.createPhotoPage.setPhotoUrl(newurl);

// Note that you have a list of all available functions for the specified services at the right of the filter code window
