var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config');
var jwt = require('jwt-simple');
var app = express();

require('./db');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(require('./auth'));

app.get('/', function(req,res) {
    res.sendFile(__dirname +'/public/index.html');
});

app.use('/api/sessions', require('./server/routes/api/sessions'));
app.use('/api/users', require('./server/routes/api/users.js'));
app.use('/api/events', require('./server/routes/api/events.js'));


app.listen(3000, function() {
    console.log("Server up and running at 3000");
});