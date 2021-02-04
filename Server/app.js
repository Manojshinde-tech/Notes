const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')
const notes = require('./routes/notes.routes');

expressValidator = require('express-validator');
// initialize our express app
const app = express();

//Set up mongoose connection
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/notes');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  console.log("connected");
});
app.use(cors())
app.use(expressValidator());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', notes);

let port = 7000;
app.get('/notes', require('./controller/notes.server.controller').postNotes);
app.listen(port, () => {
  console.log('Server is up and running on port numner ' + port);
});
module.exports = app;
