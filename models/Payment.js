// Filename - model/Payment.js

const mongoose = require('mongoose')
const Schema = mongoose.Schema

var Product = new Schema({
    Product_name: {
        type: String,
        // required: true
    },
    Product_picture: {
        type: String,
        // required: true
    },
    
    Product_price: {
        type: Number,
        // required: true
    },
    Product_quantity: {
        type: Number,
        
    }
})

 
module.exports = mongoose.model('Product', Product)


