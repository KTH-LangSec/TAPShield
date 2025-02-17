// https://www.reddit.com/r/ifttt/comments/6or9nu/can_i_host_the_typescript_file_somewhere_else_and/

//IFTTT TypeScript File
var title = 'Reddit.newTopPostInSubreddit.Title';
var imageURL = 'Reddit.newTopPostInSubreddit.ImageURL';
var content = 'Reddit.newTopPostInSubreddit.Content';
var output = myFuction (title, imageURL, content);
sink('Blogger.createPostBlogger','setBody',output);

//Hosted TypeScript File
function myFuction (x, y, z)
{
//do stuffs
return output;
} 


