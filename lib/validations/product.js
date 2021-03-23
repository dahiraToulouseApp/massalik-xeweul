const { body } = require('express-validator');

const productValidation = [
    body('name').isString().isLength({ min: 2, max: 255 }),
    body('price').isNumeric().isLength({ max: 255 }),
  ];

module.exports.productValidation = productValidation;
