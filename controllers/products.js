const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
    //to show the async errors at work
    //throw new Error('testing async errors')

    //const products = await Product.find({}).sort('-name price')
    const products = await Product.find({price:{$gt:30}})
        .sort('price')
        .select('name price')
        .limit(10)
        .skip(5)
    res.status(200).json({products, nbHits: products.length,})
}

const getAllProducts = async (req, res) => {
    //we are telling the users in our docs this names
    //so they can add to the query, we decide the names
    const {featured, company, name, sort, fields, numericFilters} = req.query
    const queryObject = {}
    if (featured) {
        //using the ? operator
        //the featured is going to come as a string in req.query
        // we are comparing it with 'true', if they are the same
        //it will assign true, otherwise, false
        queryObject.featured = featured ==='true' ? true:false
    }
    if(company){
        queryObject.company = company
    }
    if(name){
        //we are using query operators from mongoDB
        queryObject.name = {$regex: name, $options: 'i'}
    }
    if (numericFilters) {
        
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        }
        //we use regEx to translate
        const regEx = /\b(<|>|>=|=|<=)\b/g
        let filters = numericFilters.replace(
            regEx, 
            (match)=>`-${operatorMap[match]}-`
        )
        
        //our only numeric fields are PRICE and RATING
        const options = ['price', 'rating']
        //we are going to split our filters one by one
        //every filter type is separated with a coma 
        filters = filters.split(',').forEach((item)=>{
            //we are going to de compose the filter line in the 3 components
            //we purposedly used - before to do this
            const [field, operator, value] = item.split('-')

            //here we check that the field sent is actually one of our
            //options, and if it is, we are setting the property
            //in the queryObject to the defined pattern
            if(options.includes(field)){
                queryObject[field] = {[operator]:Number(value)}
            }
        })


        console.log(queryObject)
    }
    //console.log(queryObject)

    //following mongoose documentation, limit, sort etc have to be
    //chained to the find, but since we dont know if we are going to
    //get a sort or not we have to add it to the call
    // const products = Product.find(queryObject).sort(xxxx)
    //to solve this we use let and chain the functions if we need to
    //and only after the query is built we trigger it and return the result
    //to products
    let result =  Product.find(queryObject)
    if(sort){
        //mongoose requires multiple sort parameters to be 
        // separated by space not comma
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    }
    else{
        //default sort in case the user didnt specified one
        result = result.sort('createdAt')
    }

    //to select the fields we want to get returned
    //like selecting columns
    if(fields){
        const fieldList = fields.split(',').join(' ')
        result = result.select(fieldList)
    }
    //in our documentation we asked to provide a page
    //but it returns as a string
    //we are using the || to set values in case the user does not provide
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    result = result.skip(skip).limit(limit)

    //if we have 23 products, and limit = 7
    // we have 4 pages 7  7  7  2
    //so if we dont pass a page, we are defaulted by 1, 1-1 = 0 * 7, we skip 0
    //if we are provided a page then we skip x-1*limit per page

    const products = await result
    res.status(200).json({products, nbHits: products.length,})
}


module.exports = {
    getAllProducts,
    getAllProductsStatic,
}