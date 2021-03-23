const { string } = require('joi');
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 25,
        trim: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        minlength: 5,
        maxlength: 1024,
        trim: true,
        require,
    },
    categories: [String],
    weight: {
        type:String
    },
    discount: {
        type:Number
    }
      
});

module.exports = new mongoose.model('Product', productSchema);