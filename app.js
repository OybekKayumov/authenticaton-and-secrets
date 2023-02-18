//jshint esversion:6
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

console.log('process.env.API_KEY: ', process.env.API_KEY);

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}))

// mongodb
mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser: true})

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

// const secret = "Thisisourlittlesecret"
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"] });

const User =  new mongoose.model("User", userSchema);

//get
app.get('/', (req, res) => {
  res.render('home');
})

app.get('/login', (req, res) => {
  res.render('login');
})

app.get('/register', (req, res) => {
  res.render('register');
})

// post
app.post("/register", function (req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  })

  newUser.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets")  // render secrets page after login
    }
  });
})

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  
  User.findOne({email: username},  function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets")
        }
      }
    }
  })  
});

app.listen(3000, function () {
  console.log("Server is running on port 3000...");
})