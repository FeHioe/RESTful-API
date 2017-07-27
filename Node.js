//requirements
var http = require('http');
var url = require('url');
var fs = require('fs');
var js = require('./favs.json'); //json file that can be altered for testing

//find all tweets
var all_tweets = new Array();
for (var i in js) {
    all_tweets.push({create_time: js[i].created_at, id: js[i].id_str ,tweet_text: js[i].text.replace(/(\r\n|\n|\r)/gm," "),});
}

//find all users
var all_users = new Array();
var duplicate = new Array();
for (var i in js) {
	if (duplicate.indexOf(js[i].user.screen_name) == -1){
		duplicate.push(js[i].user.screen_name);
		all_users.push({username : js[i].user.screen_name, name : js[i].user.name, description : js[i].user.description, location : js[i].user.location, website : js[i].user.url});
	}
}

//find users in user mentions
var user_ment = new Array();
for (var i in js) {
  user_ment.push(js[i].entities.user_mentions);
}

//flatten the nested arrays
var flatten = new Array();
for (var i in user_ment){
  for (var z in user_ment[i]){
    flatten.push(user_ment[i][z]);
  }
}

//add users who are mentioned but did not tweet
for (var i in flatten) {
  if (duplicate.indexOf(flatten[i].screen_name) == -1){
     duplicate.push(flatten[i].screen_name);
     all_users.push({username: flatten[i].screen_name, name : flatten[i].name, in_mentions : "user only found in mentions"});
  }
}

//get links found in tweets
var all_links = new Array();
for (var i in js){
  all_links.push({tweet_id : js[i].id, urls : []});
}

for (var i in all_tweets) {
	for (var k in all_tweets[i].tweet_text.split(" ")){
		if (all_tweets[i].tweet_text.split(" ")[k].search("http:")> -1 || all_tweets[i].tweet_text.split(" ")[k].search("https:")> -1 || all_tweets[i].tweet_text.split(" ")[k].search("www.")> -1){
			for (var m in all_links){
			  if (all_links[m].tweet_id == all_tweets[i].id){
			    all_links[m].urls.push({ tweet_text_link : all_tweets[i].tweet_text.split(" ")[k]});
			  }
			}
		}
	}
}

//get links found in source
for (var i in js) {
  for (var m in all_links){
   for (var k in js[i].source.split(" ")){
	if (js[i].source.split(" ")[k].search("http:")> -1 || js[i].source.split(" ")[k].search("https:")> -1 || js[i].source.split(" ")[k].search("www.")> -1){
	  if (all_links[m].tweet_id == all_tweets[i].id){
	    all_links[m].urls.push({source_link : js[i].source.split(" ")[k].substring(6, js[i].source.split(" ")[k].length)});
	  }
	}
  }

  
//get links found in user description
   for (var k in js[i].user.description.split(" ")){
	if (js[i].user.description.split(" ")[k].search("http:")> -1 || js[i].user.description.split(" ")[k].search("https:")> -1 || js[i].user.description.split(" ")[k].search("www.")> -1){
	  if (all_links[m].tweet_id == all_tweets[i].id){
	    all_links[m].urls.push({user_description_link : js[i].user.description.split(" ")[k]});
	  }
	 
	}
	
    }
//get links in user url
  if (all_links[m].tweet_id == all_tweets[i].id){
    all_links[m].urls.push({user_url : js[i].user.url});
	  
//get links in user entities url
   for (var x in js[i].user.entities.url.urls){
    all_links[m].urls.push({user_entities_url : js[i].user.entities.url.urls[x].url});
   }
//get profile background image
    all_links[m].urls.push({prof_back : js[i].user.profile_background_image_url});

//get profile background image https
    all_links[m].urls.push({prof_back_https : js[i].user.profile_background_image_url_https});

//get profile picture image
    all_links[m].urls.push({prof_pic : js[i].user.profile_image_url});

//get profile picture image https
    all_links[m].urls.push({ prof_pic_https : js[i].user.profile_image_url_https});
    
//get entities url
    for (var x in js[i].entities.urls){
    all_links[m].urls.push({entities_url : js[i].entities.urls[x].url});
    }
  }
	 
  }
}

//create server instance 
http.createServer(function (request, response) {
//get url
var path = url.parse(request.url).pathname;
    
//for getting all the tweets 
    if(path=="/getTweets"){
        console.log("tweet request recieved");
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write(JSON.stringify(all_tweets, null, '\t'));
	response.end();
        console.log("all tweets sent");

//for getting all the users
    }else if (path=="/getUsers") {
        console.log("users request received");
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write(JSON.stringify(all_users, null, '\t'));
	response.end();
        console.log("all users sent");
    
//for getting all links inside a tweet
    } else if (path=="/getLinks") {
        console.log("links request received");
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write(JSON.stringify(all_links, null, '\t'));
	response.end();
        console.log("all links sent");
    
//for finding a requested tweet
    } else if (path.match("/findTweet")) { 
        console.log("find tweet request received");
        response.writeHead(200, {"Content-Type": "text/plain"});
	var tweetid = path.slice(11);
	var found_tweet = "No such tweet.";
	for (var i in js) {
		if (js[i].id == tweetid) {
			found_tweet = {username : js[i].user.screen_name, tweet_text : js[i].text, create_time : js[i].created_at};
		}
	}
        response.write(JSON.stringify(found_tweet, null, '\t'));
	response.end();
        console.log("found tweet");

//for finding a requested user
    } else if (path.match("/findUser")) { 
        console.log("find user request received");
        response.writeHead(200, {"Content-Type": "text/plain"});
	var username = path.slice(10);
	var found_user = "User not found.";
	for (var i in all_users) {
		if (all_users[i].username == username) {
			found_user = all_users[i];
		}
	}
        response.write(JSON.stringify(found_user , null, '\t'));
	response.end();
        console.log("found user");

//show index html file - display the front end
    } else{ 
        fs.readFile('./index.html', function(err, file) {  
            if(err) {  
                console.log("Index reading error.");
                return;                                                                                              
            }  
            response.writeHead(200, { 'Content-Type': 'text/html' });  
            response.end(file, "utf-8");  
        });
    }
}).listen(3000);

// Server has loaded properly
console.log('Server running at localhost:3000');
