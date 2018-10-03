//jshint esversion:6, node:true
let express = require('express');  
let app = express();

let http = require('http').Server(app);
let io = require('socket.io')(http);

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.static(__dirname+'/public'));
app.use('/scripts', express.static(__dirname + '/node_modules'));


// ========= SERVER RUNNING

app.get("/", function(req, res) {
    res.render("layout", {});
});

let port = process.env.port | 8080;

http.listen(port);

console.log("Welcome to the BadgerMusic Server!");
console.log("Magic happens on port " + port);