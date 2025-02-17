// Title: Get an email whenever a new Craigslist post matches your search
// Maker: mckenziec
// Link : https://ifttt.com/applets/79p-get-an-email-whenever-a-new-craigslist-post-matches-your-search

// Trigger: Classifieds -> New post from search
// Action : Email -> Send me an email

// Policy/Presence: Confidentiality of posts / No

postTitle = lbl("Classifieds.newPostFromSearch.PostTitle");
postUrl = lbl("Classifieds.newPostFromSearch.PostUrl");
postContent = lbl("Classifieds.newPostFromSearch.PostContent");
postLink = urlh(postUrl);
sink('Email.sendMeEmail', 'setSubject', 'Interesting Posts');
sink('Email.sendMeEmail', 'setBody', postTitle + postContent + postLink);
