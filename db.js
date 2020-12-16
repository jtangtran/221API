//loads the mongoose module and exposes its function via the constant
const mongoose = require('mongoose');

// connect to locally running MongoDB instance
//database connection string
let dbURI = 'mongodb://localhost:27017/msgs_db';

if (process.env.NODE_ENV === 'production') {
    dbURI = process.env.MONGO_URL;
  }

//connects to the db 
mongoose.connect(dbURI, {
//second arg is a JS Object to prevent a deprecation warning
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// print message to console when connected to DB
//connection is an object that represents the connection to the db
//object emits events
//on method allowsa callback to be defined for an associated event (event is connected)
//first arg to on is the name of the vent, second arg is the call back (function to be executed when this event occurs), 
//callback is an anonymous function which prints out a connected message to the console
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to ' + dbURI);
});

// print error message to console
// if there is a problem connecting
//define callbacks for the error and disconnected events
//print messages to the console
mongoose.connection.on('error', (err) => {
    console.log('Mongoose connection error:' + err);
});
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

require('./models/message_schema');
require('./models/user_schema');

