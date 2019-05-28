//jshint esversion:6
require('dotenv').config();
const fs =  require('fs');
const restify = require("restify");
const uuidv4 = require("uuid/v4");
const {Storage} = require('@google-cloud/storage');
const CLOUD_BUCKET = process.env.CLOUD_BUCKET;
const GOOGLE_CLOUD_PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID;
const GOOGLE_CLOUD_KEYFILE = 'UboraAwards-918af3abb9f5.json';

const storage = new Storage({
  projectId: GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: GOOGLE_CLOUD_KEYFILE
});

const bucket = storage.bucket(CLOUD_BUCKET);

const express = require('express');
const multer = require('multer');
let upload = multer({dest: 'uploads/'});
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

const EventSchema = new mongoose.Schema({
  location: String,
  date: String,
  time: String,
  show_location: Boolean,
  header_image_src: String
});

const Category = new mongoose.model('Category', CategorySchema);
const Event = new mongoose.model('Event', EventSchema);

let db = firebase.firestore();

var users = ['Yoofi'];
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

app.get('/', function(req,res){
  Event.find(function(err, eventInfoFromDB){
    if(err){
      console.log(err);
    }else{
      console.log(eventInfoFromDB);
      res.render('index', {eventInfo:eventInfoFromDB});  
    }
  });
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
  }});
});

app.post('/add_nominee', upload.single('nom_image'), function(req,res){
  const file = req.file;
  const gcsname = uuidv4() + file.originalname;

  const files = bucket.file(gcsname);
  
  let nominee = {
    name: req.body.nom_name,
    year_group: req.body.nom_yg,
    major : req.body.nom_major,
    image_source: `https://storage.googleapis.com/${CLOUD_BUCKET}/${gcsname}`,
    description : req.body.nom_descr
  };

  Category.updateOne({name: req.body.nom_cat}, {$push: {nominees: nominee}},function(err){
    if(err){
      console.log(err);
    }else{
      console.log("Success");
    }
  });

fs.createReadStream(file.path)
  .pipe( files.createWriteStream({
      metadata: {
        contentType: file.type
      }
    }))
    .on("error", (err) => {
      restify.InternalServerError(err);
      console.log(err);
    })
    .on('finish', () => {
      res.redirect('/view_nominees');
    });
   console.log(gcsname);

});

app.get('/view_categories', function(req,res){
  let categories = [];
  Category.find(function(err, categories){
    if(err){
      console.log(err);
    }else{
      res.render('view_categories', {categoriesRegistered:categories});
  }});
});

app.get('/view_nominees', function(req,res){
  Category.find(function(err, categories){
    if(err){
      console.log(err);
    }else{
      res.render('view_nominees', {nomineesRegistered:categories});
  }});
});

app.get('/edit_info', function(req,res){
  Event.find(function(err, eventInfoFromDB){
    if(err){
      console.log(err);
    }else{
      console.log(eventInfoFromDB);
      res.render('edit_info', {eventInfo:eventInfoFromDB});  
    }
  });
});

app.post('/edit_info', function(req, res){
  let event_date = req.body.ev_date;
  let event_time = req.body.ev_time;
  let event_location = req.body.ev_location;
  let showLocation;
  if(req.body.showLocation == "on"){
    show_location = true;
  }else{
    show_location = false;
  }
  let header_img = req.body.headerImg;

  Event.updateOne({}, {location:event_location, date:event_date, time:event_time, show_location:show_location, header_image_src:header_img},function(err){
    if(err){
      console.log(err);
    }else{
      console.log(event_date, event_location, event_time, show_location, header_img);
      res.redirect('/');
    }
  });
});

app.get('/upload', function(req,res){
  res.render('upload');
});

app.listen(3000, function(){
  console.log("Server up and running on port 3000");
});
