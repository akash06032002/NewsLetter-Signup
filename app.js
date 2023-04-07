const express = require("express");
const app = express();
const axios = require("axios");
const https = require("https");
require('dotenv').config();
const apiKey = process.env.MAILCHIMP_API_KEY; //apiky

app.use(express.urlencoded({extended:true})); //to grab info that gets posted in your server via html

app.use(express.static(__dirname));   //to serve static files-html,css,imags   //we can also  us __dirname as static fils are present in public

app.post("/", function(req,res){
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let email = req.body.email;
  // console.log(req.body.firstName);
  // console.log(req.body.lastName);
  // console.log(req.body.email);

  const data = {      //js obj
    email_address : email,
    status : "subscribed",
    merge_fields: {
      FNAME : firstName,
      LNAME : lastName
    }
  }
  //converting data obj to string
  const jsonData = JSON.stringify(data);  //we want to send data to mailchimp
  const url = process.env.MAILCHIMP_URL ; //mailchimp api endpoint, /lists/{list_id}-> optional path to subscribe to member

  const options = {
    method: "POST",  //as we are posting data to external api
    auth: `Akash:${apiKey}`         //--user 'anystring:TOKEN , authentication
  }

  const Request =  https.request(url, options, function(response){
    // console.log(response.statusCode);
    const statusCode = response.statusCode;
    response.on("data", function(data){
      console.log(JSON.parse(data)); //checking what data did they send
    })
    if (statusCode==200)
    {
      res.sendFile(__dirname + "/success.html");
    }
    else
    {
      res.sendFile(__dirname + "/failure.html");
    }
    // res.send();
  });  //saving request in a const

  Request.write(jsonData); //sending data to mailchimp's Server
  Request.end(); //done with the req
  //WE WANT TO POST DATA TO THE EXTERNAL RESOURCE
  // https.request(url[, options][, callback])
  // url <string> | <URL>
  // options <Object> | <string> | <URL> Accepts all options from http.request(), with some differences in default values:
  // protocol Default: 'https:'
  // port Default: 443
  // agent Default: https.globalAgent
  // callback <Function>
  // Returns: <http.ClientRequest>

})

app.post("/failure",function(req,res){  //handles post on failure section
  res.redirect("/");  //will redirect to home route
})


app.get("/",function(req,res){
  res.sendFile(__dirname + "/signup.html");
})


app.listen(process.env.PORT || 3000,function(req,res){  //process.env.PORT-> Dynamic port that Heroku defines on te go, process is defined by heroku
  console.log("Server is running on port 3000");
})

// API key
// 30a98e96ca307ab4cdd73a99c38dea73-us21
//audience/ list ID
 // b75fb366fa
