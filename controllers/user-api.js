const mongoose = require('mongoose');
const userModel = mongoose.model('user');
//passport supports different authentication strategies 
const passport = require('passport');
//the diff between local and basic stratgy is that local expects authentication credentials in the body of reuqest
//const BasicStrategy = require('passport-http').BasicStrategy;
const LocalStrategy = require('passport-local');
const jwt = require('jsonwebtoken');

 // for verifying JWT tokens
 //loads the JWT strategy and the class for decoding a token
 const JwtStrategy = require('passport-jwt').Strategy;
 const ExtractJwt = require('passport-jwt').ExtractJwt;
 //set up some configuration optiosn for the jwt strategy
 let jwtOptions = {};
 jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
 jwtOptions.secretOrKey = process.env.JWT_SECRET;

const login = (req, res) => {
  //res.status(200).send('Succesful API Login Request');
  // generates a JWT Token
  jwt.sign(
    //first arg to jwt.sign()
    //claims we want stored in the tokens payload
    { sub: req.user._id },
    //contains secret key
    process.env.JWT_SECRET,
    //setting expiry token
    { expiresIn: '1h'},
    //callback function will be executed after the token is generated
    ( error, token) => {
      if (error) {
        res
        .status(400)
        .send('Bad Request. Couldn\'t generate token.');
      } else {
        res.status(200).json({ token: token });
      }
    }
  );
}

// for token authentication
//first arg configures how to decode the token
//next arg is a callback that gets executed after the token has been decoded
//jwt payload is the decoded payload from the token
passport.use(new JwtStrategy(
  jwtOptions, (jwt_payload, done) => {
    userModel
    .findById(jwt_payload.sub)
    .exec( (error, user) => {
      // error in searching
      if (error) return done(error);

      if (!user) {
        // user not found
        return done(null, false);
      } else {
        // user found
        return done(null, user);
      }
    })
  }
));

const registerNewUser = (req, res) => {
    //res.status(200).send('Successful API New User POST Request');
    userModel
    //look for a document in the collection that contains
    //either an email or usernam (using the $or operator)
    .findOne({
      '$or': [
        { email: req.body.email },
        { username: req.body.username }
      ]
    })
    .exec( (error, user) => {
      // bad email or username
      if (error) {
        return res
        .status(400)
        .send('Bad Request. The user in the body of the \
          Request is either missing or malformed.');
      } else if (user) {
        // user found, this is a duplicate email or username
        return res
        .status(403)
        .send('Forbidden. Username or email \
          already exists.');
      } else {
        // got to this point, no errors or duplicates found
        userModel
        .create( req.body, (error, user) => {
          if (error) {
            res
            .status(400)
            .send('Bad Request. The user in the body of the \
              Request is either missing or malformed.');
            console.log(error);
          } else {
            res.status(201).json(user);
          }
        });
      }
    });
  }

  //you must provide to verify a callback (function that will be executed when auth is required)
  //verify callback for the basic strategy gets 3 args, username, password, reference to a function that passport executes when your verification is done
  //inside our classback we use findOne() to find a document based on the email or username passedin
  
  passport.use(new LocalStrategy(
    (username, password, done) => {
      userModel
      .findOne({
        '$or': [
          { email: username },
          { username: username }
        ]
      })
      .exec( async (error, user) => {
        if (error) return done(error);
 
        // user wasn't found
        if (!user) return done(null, false);
 
        // user was found, see if it's a valid password
        if (!await user.verifyPassword(password)) { return done(null, false); }
        return done(null, user);
      });
    }
  ));

module.exports = {
    registerNewUser,
    login
};