//jshint esversion:6
const express = require('express');
const mongoose = require('mongoose');
const bodyParser  = require('body-parser');
const ejs = require('ejs');
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const ArticleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article",ArticleSchema);

app.get("/articles", function(req,res){
  Article.find(function(err, results){
    res.send(results);
  });
});

app.listen(3002, function(){
  console.log("Server up and running on port 3000");
});
