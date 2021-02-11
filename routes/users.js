var express = require('express');
var router = express.Router();
var passport = require('passport')
var User = require('../models/user');

/* GET users listing. */
// router.use('/', notLoggedIn, (req, res, next) => {
//   next();
// });

function genUserID() {
  var ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var ID_LENGTH = 8;
  var rtn = '';
  for (var i = 0; i < ID_LENGTH; i++) {
    rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
  }
  return rtn;
}

router.post('/test', (req, res) => {
  console.log()
  let newUser = new User();
  let userID = genUserID();
  newUser.email = req.body.email;
  newUser.userID = userID;
  newUser.firstName = req.body.firstName;
  newUser.lastName = req.body.lastName;
  newUser.password = newUser.encryptPassword(req.body.password);
  console.log(newUser)
  newUser.save()

  res.send(newUser)
});


router.get('/logout', isLoggedIn, (req, res) => {
  req.logOut();
  res.redirect('/');
});



router.post('/signup', passport.authenticate('local-signup', {
  // successRedirect: '/users/profile', ==> callback
  failureRedirect: '/signup',
  failureFlash: true
}), (req, res, next) => {
  if (req.session.oldUrl) {
    let oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    res.redirect('/');
  }
});

router.post('/signin', passport.authenticate('local-signin', {
  // successRedirect: '/users/profile',instead this ==> callback function
  failureRedirect: '/signin',
  failureFlash: true
}), (req, res, next) => {
  if (req.session.oldUrl) {
    let oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    res.redirect('/');
  }
});

module.exports = router;


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}