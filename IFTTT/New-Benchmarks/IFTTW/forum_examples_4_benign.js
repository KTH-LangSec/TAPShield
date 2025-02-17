// Title: Create a Blogger entry from a Reddit post
// Maker: ---
// Link : https://www.reddit.com/r/ifttt/comments/6or9nu/can_i_host_the_typescript_file_somewhere_else_and/

// Trigger: Reddit -> New top post in subreddit
// Action : Blogger -> Create a post

// Policy/Presence: Confidentiality of Reddit user post or other data / No


title = lbl('Reddit.newTopPostInSubreddit.Title');
imageURL = lbl('Reddit.newTopPostInSubreddit.ImageURL');
content = lbl('Reddit.newTopPostInSubreddit.Content');
output = myFunction(title, imageURL, content);
sink('Blogger.createPostBlogger', 'setBody', output);

function myFunction(x, y, z){
	return x + y + z;
} 
