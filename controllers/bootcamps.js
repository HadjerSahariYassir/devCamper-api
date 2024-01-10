const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
//@desc     Get all bootcamps
//@route    Get /api/v1/bootcamps
//@access   Public
exports.getBootCamps = asyncHandler(async(req, res, next) => {
    // Copy req.query
    const reqQuery = { ...req.query }
    //fields to exclude
    const removeFields = ['select', 'sort'];
    //Loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param])
    //Create query string
    let queryStr = JSON.stringify(reqQuery);
    //Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);
    let query = Bootcamp.find(JSON.parse(queryStr)); 
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
    //finding resource
    const bootcamps = await query; 
    res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps
    })
});

//@desc     Get single bootcamps
//@route    Get /api/v1/bootcamps/:id
//@access   Public
exports.getBootCamp = asyncHandler(async(req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if(!bootcamp){
      return next (new ErrorResponse(`Bootcamp not found with id (not in database)${req.params.id}`, 404))
    }
    res.status(200).json({
      success: true,
      data: bootcamp 
    })
});

//@desc     Create new bootcamp
//@route    POST /api/v1/bootcamps
//@access   Private
exports.createBootCamp = asyncHandler(async(req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      data: bootcamp
    })
    res.status(201).send({ success: true, msg: "create a  new bootcamp" });
});

//@desc     Update single bootcamps
//@route    PUT /api/v1/bootcamps/:id
//@access   Private
exports.updateBootCamp = asyncHandler(async(req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }); 
    if(!bootcamp){
      return next (new ErrorResponse(`Bootcamp not found with id (not in database)${req.params.id}`, 404))
    }
    res.status(200).json({
      success: true,
      data: bootcamp
    })
});
//@desc     Delete single bootcamps
//@route    DELETE /api/v1/bootcamps/:id
//@access   Private
exports.deleteBootCamp = asyncHandler(async(req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if(!bootcamp){
      return next (new ErrorResponse(`Bootcamp not found with id (not in database)${req.params.id}`, 404))
    }
    res.status(200).json({
      success: true,
      data: bootcamp
    })
});

//@desc     Get bootcamps within a radius
//@route    GET  /api/v1/bootcamps/radius/:zipcode/:distance
//@access   Private
exports.getBootcampsInRadius = asyncHandler(async(req, res, next) => {
    
    const {zipcode, distance} = req.params;

    //Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const long = loc[0].longitude;

    // calculate radius
    // devide distance by the radius of the eartch = 3 963
    const radius = distance / 3963;
    const bootcamps = await Bootcamp.find({
      location: { $geoWithin: { $centerSphere: [ [ long , lat ], radius ] } }
    })

    res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps
    })

});
