var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config');
var jwt = require('jwt-simple');
var app = express();

var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');


require('./db');

require('./config/passport')(passport);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(cookieParser());

//Passport:
app.use(session({secret: "heroesNeverDie"}));
app.use(passport.initialize());
app.use(passport.session());

// app.use(require('./auth'));

//Routes:
app.use(express.static('public'));
app.get('/', function(req,res) {
    res.sendFile(__dirname +'/public/index.html');
});

app.use('/api/signup', require('./server/routes/api/signup'));
app.use('/api/sessions', require('./server/routes/api/sessions'));
app.use('/api/users', require('./server/routes/api/users.js'));
app.use('/api/events', require('./server/routes/api/events.js'));

app.get('/success', function(req,res) {
    res.json(req.user);
});

app.get('/failure', function(req,res) {
    res.send("Failure!");
});

app.listen(3000, function() {
    console.log("Server up and running at 3000");
});