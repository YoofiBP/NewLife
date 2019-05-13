//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const port = 3000;
const app = express();

var newItems = [];
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/",function(req,res){
  var option = {
    weekday:"long",
    day: "2-digit",
    month:"long",
    year:"numeric"
  };

  var today = new Date();
  var date = today.toLocaleDateString("en-US", option);
  res.render("list",{fulldate:date, newListItem:newItems});
});

app.post("/", function(req,res){
  newItem = req.body.newItem;
  newItems.push(newItem);
  res.redirect("/");
});

app.listen(port, function(){
  console.log("Server running on port "+port);
});
