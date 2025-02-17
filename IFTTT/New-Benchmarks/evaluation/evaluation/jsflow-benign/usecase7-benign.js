// https://www.reddit.com/r/ifttt/comments/6or9nu/can_i_host_the_typescript_file_somewhere_else_and/

// Create a Blogger entry from a Reddit post


title = lbl('Reddit.newTopPostInSubreddit.Title');
imageURL = lbl('Reddit.newTopPostInSubreddit.ImageURL');
content = lbl('Reddit.newTopPostInSubreddit.Content');
output = myFunction(title, imageURL, content);
sink('Blogger.createPostBlogger', 'setBody', output);

function myFunction(x, y, z){
	return x + y + z;
}
