//Maker: mckenziec
//Link2Applet: https://ifttt.com/applets/79p-get-an-email-whenever-a-new-craigslist-post-matches-your-search
//Title of Applet: Get an email whenever a new Craigslist post matches your search  
//Trigger service: Classifieds
//Action service: Email
//Policy/Presence: Confidentiality of posts / NO 

postTitle = lbl("Classifieds.newPostFromSearch.PostTitle");
postUrl = lbl("Classifieds.newPostFromSearch.PostUrl");
postContent = lbl("Classifieds.newPostFromSearch.PostContent");

postLink = '<link src=\"' + postUrl +'\">';

sink('Email.sendMeEmail', 'setSubject', 'Interesting Posts');
sink('Email.sendMeEmail', 'setBody', postTitle + postContent + postLink);

