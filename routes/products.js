var express = require('express');
var router = express.Router();
const Product = require('../models/productModel');
const { productValidation } = require('../lib/validations/product');
const { validationResult } = require('express-validator');
const isAdmin = require('../lib/middlewares/adminVerifier');
const verifyUser = require('../lib/middlewares/userVerifier');
const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req,file, cb) {
    cb(null,  'public/images/')
  },
  filename: function(req,file, cb) {
    cb(null, new Date().toDateString() + '_' + file.originalname);
  },
})
const upload = multer({storage: storage});


router.get('/', verifyUser, async function(req, res, next) {
  try {
    let productsList = await Product.find({});
    return res.json({products: productsList});
  }
  catch (err){
    return res.status(400).send(err);
  } 
});


router.get('/:id', verifyUser, async function(req, res, next) {

  if(!req.params || !req.params.id){
    return res.status(400).json({ error: {message: 'Il faut fournir un id pour récupérer un produit'}});
  }
  try {
  let product = await Product.findOne({_id: req.params.id});
  return res.json(product);
  }
  catch (err){
    return res.status(400).send(err);
  } 
});

router.post('/new' , isAdmin, upload.single('image'),  productValidation,  async function(req, res, next) {
  try {
    // const errors = validationResult(req);

    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }

    const isProductExist = await Product.findOne({name: req.body.name});

    if (isProductExist) {
      return res.status(400).json({ error: {message: `Product with the name ${req.body.name} is already exist`}});
    }

    let product = req.body;
    product.image = 'http://localhost:3000/images/' + req.file.filename;

    const newProduct = await new Product(product);
    await newProduct.save();

    return res.json({product: newProduct});
  }
  catch (err){
    return res.status(400).send(err);
  } 
});

module.exports = router;
