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

app.post("/login", auth.doLogin);
app.get("/logout", auth.logout);
app.get("/signup", auth.register);
app.post('/signup', auth.doRegister);
app.post("/remacc", auth.removeAccount);

app
    .get("/myaccount", function(req, res) {
        res.render("myaccount", { user : req.user });
    })
    .get("/modifyacc", auth.modifyAccount)
    .post("/modifyacc", auth.doModifyAccount)
;

// ========= API ROUTER

let router = express.Router(); 

router.route('/accountz')
    .get(function(req, res) {
        Account.find({}, function(err, bears) {
            if (err) {
                console.log('error');
                res.send(err);
            }
            res.json(bears);
        });
    });

router.route('/accounts/:acc_id')
    .get(function(req, res) {
        Account.findById(req.params.acc_id, function(err, acc) {
            if (err) {
                console.log('error');
                res.send(err);
            }
            res.json(acc);
        });
    })
    .put(function(req, res) {
        // use our bear model to find the bear we want
        Account.findById(req.params.acc_id, function(err, acc) {
            if (err) res.send(err);

            acc.username = req.body.username;
            acc.nickname = req.body.nickname;
            acc.password = hex_md5(req.body.password);

            acc.save(function(err) {
                if (err) res.send(err);
                res.json({ message: 'Account updated!' });
            });

        });
    })
    .delete(function(req, res) {
        Account.remove({
            _id: req.params.acc_id
        }, function(err, bear) {
            if (err) res.send(err);
            res.json({ message: 'Successfully deleted' });
        });
    });

//router.route('/accounts_remall')
//    .get(function(req, res) {
//        Account.remove({}, 
//        function(err, bear) {
//            if (err) res.send(err);
//            res.json({ message: 'Successfully deleted' });
//        });
//    }); 

app.use('/api', router);


// ========= SERVER RUNNING

let port = process.env.port | 8080;

http.listen(port);

console.log("Welcome to the BadgerMusic Server!");
console.log("Magic happens on port " + port);