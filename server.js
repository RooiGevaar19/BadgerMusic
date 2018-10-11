//jshint esversion:6, node:true
let express = require('express');  
let app = express();

let http = require('http').Server(app);
let io = require('socket.io')(http);

let bodyParser = require('body-parser');
let stylus = require('stylus');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.static(__dirname+'/public'));
app.use('/scripts', express.static(__dirname + '/node_modules'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;

app.use(require('express-session')({
    secret: 'januszpawlacztrzecilaczylmalesieci',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// ========= MODELS AND CONTROLLERS

let auth = require("./controllers/userController.js"); 
let Account = require('./models/Account.js');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// ========= DATABASE

let mongoose = require('mongoose');
mongoose.connection.on("error", console.error.bind(console, "connection error;"));
mongoose.connection.once("open", function callback () {
    //console.log("Connected to MongoDB.");
});
//mongoose.connect("mongodb://januszpawlacz:jp2gmd2137@ds161710.mlab.com:61710/microebay");
mongoose.connect("mongodb://localhost:27017/badgermusic");

// ========= HTTP FUNCTIONS

app.get("/", function(req, res) {
    res.render("index", { user : req.user });
});
app.get("/login", function(req, res) {
    res.render("account_signin", {});
});
app.post('/login', function(req, res) {
    auth.doLogin(req, res);
});
app.get('/logout', function(req,res) {
    auth.logout(req,res);
});
app.get('/signup', auth.register);
app.post('/signup', auth.doRegister);

app.get("/myaccount", function(req, res) {
    res.render("myaccount", { user : req.user });
});

// ========= SERVER RUNNING

let port = process.env.port | 8080;

http.listen(port);

console.log("Welcome to the BadgerMusic Server!");
console.log("Magic happens on port " + port);