const express = require('express');
const router = express.Router();
const passport = require('passport');

const msgAPIController = require('../controllers/msg-api');
const userAPIController = require('../controllers/user-api');

router.route('/messages')
.get(msgAPIController.getAllMessages)
//passport.authenticate() will be called when an attempt is made to POST a new msg

.post(passport.authenticate('jwt', { session: false }),
msgAPIController.addNewMessage);

router.route('/users')
.post(userAPIController.registerNewUser);

router.route('/login') 
.post(passport.authenticate('local', {session: false}),
userAPIController.login);

module.exports = router;
