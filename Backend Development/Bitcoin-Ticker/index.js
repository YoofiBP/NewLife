//jshint esversion:6

const express = require('express');
const bodyParser = require("body-parser");
const request = require('request');
const app = express();
const timestamp = 1553911283;
//const url = request('https://apiv2.bitcoinaverage.com/indices/global/history/{symbol}?at='timestamp;

app.use(bodyParser.urlencoded({extended:true}));

app.get("/", (req,res)=>
res.sendFile(__dirname+"/index.html"));

app.post("/converter", function(req,res){
var amount = req.body.amt;
var crypto = req.body.crypto;
var fiat = req.body.fiat;
var symbol = crypto+fiat;
//var price = 0;

var options = {
  url: "https://apiv2.bitcoinaverage.com/convert/global",
  method : "GET",
  qs: {
    from: crypto,
    to: fiat,
    amount: amount
  }
};

request(options, function(error, response, body){
  console.log('error:',error);
  console.log('statusCode:', response && response.statusCode);
  var data = JSON.parse(body);
  var time = data.time;
  var price = data.price;
  res.write("Time: "+time + "\n");
  res.write(amount + " " + crypto + "s is " + price + " " + fiat);
  res.send();
  //res.write("The price of "+ crypto + " is " + price +"&nbsp" +fiat+"&nbsp<a href='/'>Go home</a>");
});
});

app.get("/converter", function(req,res){
  res.sendFile(__dirname+"/converter.html");
});

app.listen(3000, function() {
  console.log("Server is running on port 3000");
});
