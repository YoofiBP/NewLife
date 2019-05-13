//jshint esversion:6

const mysql = require('mysql');

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "capstone"
});

con.connect(function(err){
  if(err) throw err;
  console.log("Connected");
  let sql = "SELECT * FROM students";
  con.query(sql, function(err, result, fields){
    if(err) throw err;
    console.log(fields);
  });
});
