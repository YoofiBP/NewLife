const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const firebase = require('firebase/app');

var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);

require('firebase/auth');
require('firebase/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyB_Ozbt-eQmuahZTu9fiFgtsSnAxdEE9NM",
    authDomain: "graphville.firebaseapp.com",
    databaseURL: "https://graphville.firebaseio.com",
    projectId: "graphville",
    storageBucket: "graphville.appspot.com",
    messagingSenderId: "1089251690898"
  };

firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var displayName = user.displayName;
    console.log(displayName);
    var email = user.email;
    console.log(email);
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    console.log(uid);
    var providerData = user.providerData;
    // ...
  } else {
    email = "noemail";
    displayName = "Dummy User";
  }
});
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

app.get('/', function(req,res){
  res.render('homepage');
});

app.get('/booking', function(req,res){
  res.render('booking_page');
});

app.get('/admin_login', function(req,res){
  res.render('admin_login');
})

app.post('/admin_login', function(req,res){
  email = req.body.email;
  password = req.body.password;
  firebase.auth().signInWithEmailAndPassword(email,password).then(function(){
    res.redirect('/admin');
  }).catch(function(error){
    let errorCode = error.code;
    let errorMessage = error.message;
  })
})

app.get('/admin', function(req,res){
  let user = firebase.auth().currentUser;
  if(user){
    res.render('admin_landing', {
      // username:displayName,
      email:email
    });
  }else{
    res.redirect('/admin_login');
  }

})

app.get('/admin_add', function(req,res){
  res.render('admin_add', {
    // username:displayName,
    email:email
  });
})

app.post('/admin_add', function(req,res){
  console.log(req.body);
})

app.get('/admin_edit', function(req,res){
  res.render('admin_edit');
})

app.get('/admin_contact', function(req,res){
  res.render('admin_contact');
})

app.listen(3000, function(){
  console.log("Server up on port 3000");
})
