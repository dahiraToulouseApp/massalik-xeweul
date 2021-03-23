var express = require('express');
var router = express.Router();
const User = require('../models/userModel');
const Cart = require('../models/cartModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { loginValidation, registerValidation } = require('../lib/validations/user');
const { body, validationResult } = require('express-validator');
const { use } = require('./products');

router.post('/register', registerValidation, async function(req, res, next) {
  try {
    // const errors = validationResult(req);

    // if (!errors.isEmpty()) {
    //   return res.status(400).send('Invalid password or email');
    // }

    const isEmailExist = await User.findOne({email: req.body.email});

    if (isEmailExist) {
      return res.status(400).send('Email already exist');
    }

    const newUser = await new User(req.body);
    await newUser.save();

    const newCart = await new Cart({userId: newUser.id, items: []});
    await newCart.save();

    req.session.clientId = newUser._id;
    req.session.isAdmin = newUser.isAdmin;

    if(req.body.remember) {
       req.session.cookie.maxAge = 365 * 24 * 60 * 60 * 1000;
    }

    res.send({email: newUser.email, firstName: newUser.firstName, lastName: newUser.lastName, isAdmin: newUser.isAdmin});
  }
  catch (err){
    return res.status(400).send(err);
  } 
});

router.post('/logout', async function(req, res, next) {
    const result = await req.session.destroy(err => {
    return res.status(200).send({});
    });
});

router.post('/login', loginValidation, async function(req, res, next) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send('Mot de passe ou email incorrect');
    }

    let user = await User.findOne({email: req.body.email});

    if (!user) {
      return res.status(400).send('Cet email n\'esxiste pas');
    }
    const isValidPassword =  bcrypt.compare(req.body.password, user.password);

    if (!isValidPassword) {
      return res.status(400).send('Mot de passe incorrect');
    }

    req.session.clientId = user._id;
    req.session.isAdmin = user.isAdmin;

    if(req.body.remember) {
       req.session.cookie.maxAge = 365 * 24 * 60 * 60 * 1000;
    }

    res.send({email: user.email, firstName: user.firstName, lastName: user.lastName, isAdmin: user.isAdmin});
  }
  catch (err){
    console.log(err);
    return res.status(400).send(err);
  } 
});

module.exports = router;


