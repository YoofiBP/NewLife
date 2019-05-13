//jshint esversion:6


const express = require('express');
const app = express();
const port = 3000;

app.get("/", function(request, response){
  response.send("<h1>Hello world</h1>");
});

app.get("/about", function(request, response){
  response.send("<h1>Yoofi Brown-Pobee</h1><p>0248506381</p><p>Ashesi University</p>");
});

app.get("/contact", function(req,res){
  response.send("<h1>Contact page</h1>");
});

app.get("/calculator", function(req,res){
  res.sendfile("form.html");
});

app.listen(port, function(){
  console.log("Starting app on port: " + port);
});
