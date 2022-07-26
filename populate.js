// to populate our database

require('dotenv').config()

const connectDB = require('./db/connect')
const Product = require('./models/product')

const jsonProducts = require('./products.json')

const start = async () =>{
    try {
        await connectDB(process.env.MONGO_URI)
        //remove all the products that are on our DB
        await Product.deleteMany()
        //populate the DB
        await Product.create(jsonProducts)
        console.log('Successs!!!!!!!')
        //if we dont exit the process we have to manually cancel it
        //since it was successful, no reason to keep it running
        // exit the process, since successful, value of 0
        process.exit(0)
    } catch (error) {
        console.log(error)
        //exit the process with return value 1
        process.exit(1)        
    }
}

start()