# RESTful-API

A basic web application that demonstrates RESTful web services using a Twitter database in JSON format - this is a backend project. Information is returned from the server using simple HTTP requests, then displayed on the web page. There are currently five functions: fetching all tweets, fetching all users, fetching all links contained in tweets, finding a tweet by ID, and finding a specific user. 

If running the app locally, run node on the Node.js file and access the web page on localhost/3000 or http://127.0.0.1:3000. The five functions can be accessed with the following HTTPS requests:

Get Tweets - http://127.0.0.1:3000/getTweets

Get Users - http://127.0.0.1:3000/getUsers

Get Links - http://127.0.0.1:3000/getLinks

Find Tweet - http://127.0.0.1:3000/findTweet/(insert tweet id here)

Find User - http://127.0.0.1:3000/findUser/(insert screen name here)

If running the app on heroku, replace http://127.0.0.1:3000 with https://restful-api-demo.herokuapp.com/ to access the HTTPS requests.

Demo: https://restful-api-demo.herokuapp.com/
