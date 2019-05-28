//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req,res){
    res.sendFile(__dirname+'/index.html');
});

app.listen('3001', function(){
    console.log("App running on port 3001");
});