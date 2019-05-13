//jshint esversion:6

const express = require('express');
const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req,res){
  res.sendFile(__dirname+"/form.html");
});

app.post("/", function(req,res){
  var num1 = Number(req.body.num1);
  var num2 = Number(req.body.num2);
  var result = num1 + num2;
  res.send("<h1>The result of the calculation is "+result+"</h1><a href='/'>Go home</a>");
});

app.get("/about", function(req,res){
  res.sendFile(__dirname+"/about.html");
});

app.get("/bmiCalculator", function(req,res){
  res.sendFile(__dirname+"/bmiCalculator.html");
});

app.post("/bmiCalculator", function(req,res){
  var height = parseFloat(req.body.height);
  var weight = parseFloat(req.body.weight);
  var result = weight/(height*height);
  res.send("Your BMI is " + result + "<a href='/'>Go home</a>");
});

app.listen(3000, function(){
  console.log("Server running on port 3000");
});
