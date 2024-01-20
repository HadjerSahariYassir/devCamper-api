const asyncHandler = require('../middleware/async');

const advancedResults = (model, populate) => asyncHandler(async(req, res, next) => {
    // Copy req.query
    const reqQuery = { ...req.query }
    //fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
    //Loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param])
    //Create query string
    let queryStr = JSON.stringify(reqQuery);
   
    //Create operators ($gt, $gte, etc) 
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);
    console.log("query ", queryStr);
    let query = model.find(JSON.parse(queryStr)); 
    // Select Fiels 
    if(req.query.select){ 
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields)
    }
    //Sort 
    if(req.query.sort){
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    }else{
      query = query.sort('-createdAt')
    }
    //Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();
    let pagination = {};
    // next page
    if(endIndex < total){
       pagination.next = {
          page: page  + 1, 
          limit
      }
    }
    // previous page 
    if(startIndex > 0){
       pagination.prev = {
          page: page  - 1, 
          limit
        }
    }

    query =  query.skip(startIndex).limit(limit);
    
    if(populate){
        query = query.populate(populate);
    }
    //finding resource
    const results = await query; 
    res.advancedResults = {
      success: true,
      count: results.length,
      pagination: pagination,
      data: results
    }
    next();
})
    
module.exports = advancedResults;