//jshint esversion:6
require('dotenv').config(); //used to hide password
const express= require("express");
const bodyParser= require("body-parser");
const mongoose = require("mongoose");
const _ = require('lodash');
const app= express();
const encrypt = require("mongoose-encryption");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine", "ejs");


mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  password: String
});

//2nd level authentication/security with dotenv
const secret = process.env.SECRET;


// 2nd level authentication/security
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema);


///////////////////////Home Route
app.route("/")
.get(function(req,res){
  res.render("home");
})


///////////////////////Login Route
app.route("/login")
.get(function(req,res){
  res.render("login");
})
.post(function(req,res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if (err) {
      console.log(err);
    }
    else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets");
        }
      }
    };
  });
})


///////////////////////Register Route
app.route("/register")
.get(function(req,res){
  res.render("register");
})
.post(function(req,res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){ //if user is successfully created
    if(err) {
      console.log(err);
    }
    else {
      res.render("secrets"); //then they can see the secrets page
    };
  });
})


app.listen(3000, function(){
  console.log("Server started on port 3000")
})
