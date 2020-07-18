//jshint esversion:6
require("dotenv").config();
const fs = require("fs");
const _ = require("lodash");
const restify = require("restify");
const uuidv4 = require("uuid/v4");
const { Storage } = require("@google-cloud/storage");
const CLOUD_BUCKET = process.env.CLOUD_BUCKET;
const GOOGLE_CLOUD_PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID;
const GOOGLE_CLOUD_KEYFILE = "uboraawards-4b092-ff48af622f7a.json";

const storage = new Storage({
  projectId: GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: GOOGLE_CLOUD_KEYFILE,
});

const port = process.env.PORT || 4000;
const bucket = storage.bucket(CLOUD_BUCKET);

const express = require("express");
const multer = require("multer");
let upload = multer({ dest: "uploads/" });
const ejs = require("ejs");
const jquery = require("jquery");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");

const firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");
require("firebase/database");

firebase.initializeApp({
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
});

const dbPassword = process.env.DB_PASSWORD;
const dbUserName = process.env.DB_USERNAME;
const mongoConnection =
  "mongodb+srv://" +
  dbUserName +
  ":" +
  dbPassword +
  "@cluster0-b5vo0.mongodb.net/uboraDB";
mongoose.connect(mongoConnection, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once("open", function () {
  console.log("MongoDB database connection established successfully");
});

let models = [];

const NomineeSchema = new mongoose.Schema({
  name: String,
  year_group: String,
  major: String,
  image_source: String,
  description: String,
});

const CategorySchema = new mongoose.Schema({
  name: String,
  description: String,
  nominees: [NomineeSchema],
});

const EventSchema = new mongoose.Schema({
  location: String,
  date: String,
  time: String,
  show_location: Boolean,
  header_image_src: String,
});

const AttendeeSchema = new mongoose.Schema({
  email: String,
  fname: String,
  lname: String,
  yearGroup: Number,
});

const Category = new mongoose.model("Category", CategorySchema);
models["Category"] = Category;
const Event = new mongoose.model("Event", EventSchema);
models["Event"] = Event;
const Attendee = new mongoose.model("Attendee", AttendeeSchema);
models["Attendee"] = Attendee;
const Nominee = new mongoose.model("Nominee", NomineeSchema);

let db = firebase.firestore();

var users = ["Yoofi"];
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

function stateObserver() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
    } else {
      res.redirect("/login");
    }
  });
}

function isUserSignedIn() {
  // TODO 6: Return true if a user is signed-in.
  return !!firebase.auth().currentUser;
}

function protect(res) {
  if (!isUserSignedIn()) {
    res.redirect("/login");
  }
}

app.get("/", function (req, res) {
  Event.find(function (err, eventInfoFromDB) {
    if (err) {
      console.log(err);
    } else {
      console.log(eventInfoFromDB);
      res.render("index", { eventInfo: eventInfoFromDB });
    }
  });
});

app.get("/get_ticket", function (req, res) {
  res.render("get_ticket");
});

app.post("/get_ticket", function (req, res) {
  let fname = req.body.fname;
  let lname = req.body.lname;
  let email = req.body.email;
  let yearGroup = req.body.yearGroup;

  const attendee = new Attendee({
    fname: fname,
    lname: lname,
    email: email,
    yearGroup: yearGroup,
  });

  attendee.save(function (err, product) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/view_registered");
    }
  });
});

app.get("/view_registered", function (req, res) {
  protect(res);
  Attendee.find(function (err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render("view_registered", { usersRegistered: users });
    }
  });
});

app.get("/add_cat", function (req, res) {
  protect(res);
  res.render("add_category");
});

app.get("/add_cat/:id", function (req, res) {
  protect(res);
  let id = req.params.id;

  Category.findById(id, function (err, categoryInfo) {
    if (err) {
      console.log("err: ", err);
    } else {
      res.render("add_category", { catinfo: categoryInfo });
    }
  });
});

app.post("/add_cat", function (req, res) {
  /* FIND ITEM, IF YOU CANT, CREATE A NEW ONE */
  let id = req.body.categoryId;
  let cat_name = req.body.cat_name;
  let cat_descr = req.body.cat_descr;

  console.log("id: ", id);
  console.log("cat_name: ", cat_name);
  console.log("cat_descr: ", cat_descr);
  if (id != undefined) {
    Category.findByIdAndUpdate(
      id,
      { $set: { name: cat_name, description: cat_descr } },
      function (err, doc) {
        if (err) {
          console.log("err: ", err);
        } else {
          console.log("Found");
          res.redirect("/view_categories");
        }
      }
    );
  } else {
    const category = new Category({
      name: cat_name,
      description: cat_descr,
    });

    category.save(function (err, product) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/view_categories");
      }
    });
  }
});

app.get("/admin_view_nominees", function (req, res) {
  protect(res);
  Category.find(function (err, nomineesFromDB) {
    if (err) {
      console.log(err);
    } else {
      res.render("view_nominees_admin", { nominees: nomineesFromDB });
    }
  });
});

app.get("/add_nominee", function (req, res) {
  protect(res);
  Category.find(function (err, Nomineecategories) {
    if (err) {
      console.log(err);
    } else {
      res.render("add_nominee", { categories: Nomineecategories });
    }
  });
});

app.get("/add_nominee/:categoryId/:id", function (req, res) {
  let catId = req.params.categoryId;
  let nomId = req.params.id;

  protect(res);
  Category.find(function (err, Nomineecategories) {
    if (err) {
      console.log(err);
    } else {
      Category.findById(catId, function (err, nomineeInfo) {
        if (err) {
          console.log("err: ", err);
        } else {
          nomineeInfo.nominees.forEach(function (nominee) {
            if (nominee.id === nomId) {
              res.render("add_nominee", {
                nomineeInfo: nominee,
                categories: Nomineecategories,
              });
            } else {
              console.log("Id does not exist");
            }
          });
        }
      });
    }
  });
});

app.post("/add_nominee", upload.single("nom_image"), function (req, res) {
  const file = req.file;
  const gcsname = uuidv4() + file.originalname;

  let nomId = req.body.nominee_id;
  let category = req.body.nom_cat;
  let name = req.body.nom_name;
  let year_group = req.body.nom_yg;
  let major = req.body.nom_major;
  let image_source = `https://storage.googleapis.com/${CLOUD_BUCKET}/${gcsname}`;
  let description = req.body.nom_descr;

  const files = bucket.file(gcsname);
  const nominee = new Nominee({
    name: name,
    year_group: year_group,
    major: major,
    image_source: image_source,
    description: description,
  });

  if (nomId !== undefined) {
  } else {
  }
  Category.updateOne(
    { name: req.body.nom_cat },
    { $push: { nominees: nominee } },
    function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Success");
      }
    }
  );

  fs.createReadStream(file.path)
    .pipe(
      files.createWriteStream({
        metadata: {
          contentType: file.type,
        },
      })
    )
    .on("error", (err) => {
      restify.InternalServerError(err);
      console.log(err);
    })
    .on("finish", () => {
      res.redirect("/admin_view_nominees");
    });
  console.log(gcsname);
});

app.get("/view_categories", function (req, res) {
  protect(res);
  let categories = [];
  Category.find(function (err, categories) {
    if (err) {
      console.log(err);
    } else {
      res.render("view_categories", { categoriesRegistered: categories });
    }
  });
});

app.get("/view_nominees", function (req, res) {
  Category.find(function (err, categories) {
    if (err) {
      console.log(err);
    } else {
      res.render("view_nominees", { nomineesRegistered: categories });
    }
  });
});

app.get("/edit_info", function (req, res) {
  protect(res);
  Event.find(function (err, eventInfoFromDB) {
    if (err) {
      console.log(err);
    } else {
      console.log(eventInfoFromDB);
      res.render("edit_info", { eventInfo: eventInfoFromDB });
    }
  });
});

app.post("/edit_info", upload.single("headerImg"), function (req, res) {
  let event_date = req.body.ev_date;
  let event_time = req.body.ev_time;
  let event_location = req.body.ev_location;
  let showLocation;
  if (req.body.showLocation == "on") {
    show_location = true;
  } else {
    show_location = false;
  }
  if (req.file != undefined) {
    const file2 = req.file;
    const gcsname2 = uuidv4() + file2.originalname;

    const files = bucket.file(gcsname2);
    let header_img = `https://storage.googleapis.com/${CLOUD_BUCKET}/${gcsname2}`;

    Event.updateOne(
      {},
      {
        location: event_location,
        date: event_date,
        time: event_time,
        show_location: show_location,
        header_image_src: header_img,
      },
      function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log(
            event_date,
            event_location,
            event_time,
            show_location,
            header_img
          );
        }
      }
    );

    fs.createReadStream(file2.path)
      .pipe(
        files.createWriteStream({
          metadata: {
            contentType: file2.type,
          },
        })
      )
      .on("error", (err) => {
        restify.InternalServerError(err);
        console.log(err);
      })
      .on("finish", () => {
        res.redirect("/");
      });
    console.log(gcsname2);
  } else {
    Event.updateOne(
      {},
      {
        location: event_location,
        date: event_date,
        time: event_time,
        show_location: show_location,
      },
      function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log(event_date, event_location, event_time, show_location);
          res.redirect("/");
        }
      }
    );
  }
});

app.get("/login", function (req, res) {
  res.render("admin_login");
});

app.post("/login", function (req, res) {
  let email = req.body.admin_email;
  let password = req.body.admin_password;
  firebase
    .auth()
    .setPersistence(firebase.auth.Auth.Persistence.NONE)
    .then(function () {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(function () {
          res.redirect("/view_registered");
        })
        .catch(function (error) {
          // Handle Errors here.
          var errorCode = error.code;
          console.log("errorCode: ", errorCode);
          var errorMessage = error.message;
          console.log("errorMessage: ", errorMessage);
          res.render("admin_login", { errors: errorMessage });
          // ...
        });
    });
});

app.get("/logout", function (req, res) {
  firebase.auth().signOut();
  res.redirect("/login");
});

app.get("/delete/:model/:id", function (req, res) {
  let id = req.params.id;
  let model = _.startCase(req.params.model);

  models[model].findByIdAndRemove(id, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("back");
    }
  });
});

app.listen(process.env.PORT || port, function () {
  console.log("Server up and running on port " + port);
});
