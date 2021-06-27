var express = require('express')
  ,http = require('http')
  ,fs = require('fs')
  ,path = require('path');

var app = express();

const db = require("./models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");

  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

app.get('/movie',function(req,res){
    res.send("All Movies Data in JSON format from Mongo DB")
})
app.get('/genres',function(req,res){
    res.send("All Genres Data in JSON format from Mongo DB")
})
app.get('/artists',function(req,res){
    res.send("All Artists Data in JSON format from Mongo DB")
})
app.listen(9000, function () {
    console.log("express has started on port 3000");
   });