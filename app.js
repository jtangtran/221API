require('dotenv').config();
const cors = require('cors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');

// mongodb connection via mongoose
require('./db');
const rateLimit = require('express-rate-limit');

//import routers
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
const apiRouter = require('./routes/api_router');

//gets a reference to an express application object and stores it in app
var app = express();

//express middleware and http request will go through each one in a chain
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(rateLimit());
app.use(passport.initialize());

//routing code
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use(cors());
app.use('/', apiRouter);

module.exports = app;
