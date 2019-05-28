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

function stateObserver(){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
    } else {
      res.redirect('/login');
    }
  });
}

function isUserSignedIn() {
  // TODO 6: Return true if a user is signed-in.
  return !!firebase.auth().currentUser;
}

function protect(res){
  if(!isUserSignedIn()){
    res.redirect('/login');
  }
}


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
  protect(res);
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
  protect(res);
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
  protect(res);
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
  protect(res);
  let categories = [];
  Category.find(function(err, categories){
    if(err){
      console.log(err);
    }else{
      res.render('view_categories', {categoriesRegistered:categories});
  }});
});

app.get('/view_nominees', function(req,res){
  protect(res);
  Category.find(function(err, categories){
    if(err){
      console.log(err);
    }else{
      res.render('view_nominees', {nomineesRegistered:categories});
  }});
});

app.get('/edit_info', function(req,res){
  protect(res);
  Event.find(function(err, eventInfoFromDB){
    if(err){
      console.log(err);
    }else{
      console.log(eventInfoFromDB);
      res.render('edit_info', {eventInfo:eventInfoFromDB});  
    }
  });
});

app.post('/edit_info', upload.single('headerImg'), function(req, res){

  let event_date = req.body.ev_date;
  let event_time = req.body.ev_time;
  let event_location = req.body.ev_location;
  let showLocation;
  if(req.body.showLocation == "on"){
    show_location = true;
  }else{
    show_location = false;
  }
  if(req.file!=undefined){
  const file2 = req.file;
  const gcsname2 = uuidv4() + file2.originalname;

  const files = bucket.file(gcsname2);
  let header_img = `https://storage.googleapis.com/${CLOUD_BUCKET}/${gcsname2}`;

  Event.updateOne({}, {location:event_location, date:event_date, time:event_time, show_location:show_location, header_image_src:header_img},function(err){
    if(err){
      console.log(err);
    }else{
      console.log(event_date, event_location, event_time, show_location, header_img);
    }
  });

  fs.createReadStream(file2.path)
  .pipe( files.createWriteStream({
      metadata: {
        contentType: file2.type
      }
    }))
    .on("error", (err) => {
      restify.InternalServerError(err);
      console.log(err);
    })
    .on('finish', () => {
      res.redirect('/');
    });
   console.log(gcsname2);
  }else{
    Event.updateOne({}, {location:event_location, date:event_date, time:event_time, show_location:show_location},function(err){
      if(err){
        console.log(err);
      }else{
        console.log(event_date, event_location, event_time, show_location);
        res.redirect('/');
      }
    });
  }
});

app.get('/login', function(req,res){
  res.render('admin_login');
});

app.post('/login', function(req,res){
  let email = req.body.admin_email;
  let password = req.body.admin_password;
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)
  .then(function(){
    firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
      res.redirect('/view_registered');
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      console.log('errorCode: ', errorCode);
      var errorMessage = error.message;
      console.log('errorMessage: ', errorMessage);
      res.render('admin_login', {errors:errorMessage});
      // ...
    });
  });
});

app.post('/logout', function(req,res){
  firebase.auth().signOut();
  res.redirect('/login');
})

app.listen(3000, function(){
  console.log("Server up and running on port 3000");
});
