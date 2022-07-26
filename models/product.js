const mongoose = require('mongoose')

//structure for our data
//and initial data validation
//data validation to be imporved

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'product name must be provided'],
        trim: true,
    },
    price:{
        type: Number,
        required: [true, 'product price must be provided']
    },
    featured:{
        type: Boolean,
        default: false,
    },
    rating:{
        type: Number,
        default: 4.5,
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    company:{
        type: String,
        //enum:['ikea','liddy','caressa','marcos'],
        enum:{
            values: ['ikea','liddy','caressa','marcos'],
            message: '{VALUE} is not supported'
        }
    },
})

module.exports = mongoose.model('Product',productSchema)
