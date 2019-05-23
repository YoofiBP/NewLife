//jshint esversion:6
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const jquery = require('jquery');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');

const firebase = require('firebase/app');
require('firebase/auth');
require('firebase/firestore');
require('firebase/database');

firebase.initializeApp({
apiKey: process.env.API_KEY,
authDomain: process.env.AUTH_DOMAIN,
databaseURL: process.env.DATABASE_URL,
projectId: process.env.PROJECT_ID,
storageBucket: process.env.STORAGE_BUCKET,
messagingSenderId: process.env.MESSAGING_SENDER_ID,
appId: process.env.APP_ID
});

mongoose.connect("mongodb://localhost:27017/uboraDB", { useNewUrlParser: true });

const CategorySchema = new mongoose.Schema({
  name: String,
  description: String,
  nominees: [{
    name: String, 
    year_group: String, 
    major: String,
    image_source: String,
    description: String
  }]
});

const Category = new mongoose.model('Category', CategorySchema);

let db = firebase.firestore();

var users = ['Yoofi'];
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

app.get('/', function(req,res){
  res.render('index');
});

app.get('/get_ticket', function(req,res){
  res.render('get_ticket');
});

app.post('/get_ticket', function(req,res){
  let fname = req.body.fname;
  let lname = req.body.lname;
  let email = req.body.email;
  let yearGroup = req.body.yearGroup;

  let newUser = db.collection('registered').doc(fname+'_'+lname);
  newUser.set({
    'fname': fname,
    'lname': lname,
    'email': email,
    'yearGroup': yearGroup
  }).then(res.redirect('/'));
});

app.get('/view_registered', function(req,res){
  let users = [];
  let registeredRef = db.collection('registered');
  registeredRef.get().then(snapshot => {
    snapshot.forEach(doc => {
      users.push(doc.data());
    });
    console.log(users[1]);
    res.render('view_registered', {usersRegistered:users});
  }).catch(err => {
    console.log('Error getting documents', err);
  });
});

app.get('/add_cat', function(req,res){
  res.render('add_category');
});

app.post('/add_cat', function(req,res){
  let cat_name = req.body.cat_name;
  let cat_descr = req.body.cat_descr;

  /*let newCat = db.collection('categories').doc(cat_name);
  newCat.set({
    'name' : cat_name,
    'description' : cat_descr
  }).then(res.redirect('/view_categories'));*/
  const category = new Category({
    name: cat_name,
    description: cat_descr
  });

  category.save(function(err, product){
    if(err){
      console.log(err);
    }else{
      res.redirect('/view_categories');
    }
  });
});

app.get('/add_nominee', function(req,res){
  Category.find(function(err, Nomineecategories){
    if(err){
      console.log(err);
    }else{
      res.render('add_nominee', {categories:Nomineecategories});
  }});/*
  let registeredRef = db.collection('categories');
  registeredRef.get().then(snapshot => {
    snapshot.forEach(doc => {
      firebaseCategories.push(doc.data());
    });
    res.render('add_nominee', {categories:firebaseCategories});
  }).catch(err => {
    console.log('Error getting documents', err);
  });*/
});

app.post('/add_nominee', function(req,res){
  let nom_name = req.body.nom_name;
  let nom_major = req.body.nom_major;
  let nom_yg = req.body.nom_yg;
  let nom_image = req.body.nom_image;
  let nom_descr = req.body.nom_descr;
  let nom_cat = req.body.nom_cat;
  let today = new Date();
  let thisYear = today.getFullYear();
  /*
  let newNom = db.collection('nominees').doc(nom_name);
  newNom.set({
    'name' : nom_name,
    'major' : nom_major,
    'year_group' : nom_yg,
    'image_source': "",
    'description' : nom_descr,
    'category': nom_cat,
    'nom_year': thisYear
  }).then(res.redirect('/view_nominees'));*/
  let nominee = {
    name: nom_name,
    year_group: nom_yg,
    major : nom_major,
    image_source: "",
    description : nom_descr
  };
  Category.updateOne({name: nom_cat}, {$push: {nominees: nominee}},function(err){
    if(err){
      console.log(err);
    }else{
      console.log("Success");
      res.redirect('/view_nominees');
    }
  });
});

app.get('/view_categories', function(req,res){
  let categories = [];
  Category.find(function(err, categories){
    if(err){
      console.log(err);
    }else{
      res.render('view_categories', {categoriesRegistered:categories});
  }});
  /*let categoriesRef = db.collection('categories');
  categoriesRef.get().then(snapshot => {
    snapshot.forEach(doc => {
      categories.push(doc.data());
    });
    console.log(categories);
    res.render('view_categories', {categoriesRegistered:categories});
  }).catch(err => {
    console.log('Error getting documents', err);
  });*/
});

app.get('/view_nominees', function(req,res){
  let nominees = [];
  Category.find(function(err, categories){
    if(err){
      console.log(err);
    }else{
      res.render('view_nominees', {nomineesRegistered:categories});
  }});
  /*
  let nomineesRef = db.collection('nominees');
  nomineesRef.get().then(snapshot => {
    snapshot.forEach(doc => {
      nominees.push(doc.data());
    });
    nominees.sort((a,b)=>(a.category > b.category) ? 1:-1);
    console.log(nominees);
    res.render('view_nominees', {nomineesRegistered:nominees});
  }).catch(err => {
    console.log('Error getting documents', err);
  });*/
});

app.listen(3000, function(){
  console.log("Server up and running on port 3000");
});
