const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const path = require('path');
//@desc     Get all bootcamps
//@route    Get /api/v1/bootcamps
//@access   Public
exports.getBootCamps = asyncHandler(async(req, res, next) => {
   res.status(200).json(res.advancedResults)
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
     // Add user
    req.body.user = req.user.id;
    // Check for Published bootcamp
    const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

    if (publishedBootcamp && req.user.role !== "admin") {
      return next(
        new ErrorResponse(
          `You cannot create more than 1 bootcamp`,
          400
        )
      );
    }

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
    const bootcamp = await Bootcamp.findById(req.params.id);
    if(!bootcamp){ 
      return next (new ErrorResponse(`Bootcamp not found with id (not in database)${req.params.id}`, 404))
    }
    bootcamp.deleteOne({ _id: req.params.id});
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

//@desc   update bootcamp within a phtoto 
//@route  PUT  /api/v1/bootcamps/:id/photo
//@access  Private
exports.bootcampPhotoUpload = asyncHandler(async(req, res, next) => {
     
  const bootcamp = await Bootcamp.findById(req.params.id);

  if(!bootcamp){
    return next (new ErrorResponse(`Bootcamp not found with id (not in database)${req.params.id}`, 404))
  }
  
  const file = req.files.file;
  console.log('file image is', file);
  if(!file.mimetype.startsWith('image')){
    return next (new ErrorResponse(`Please upload a an image file`, 400))
  }
  if(!file.size > process.env.MAX_FILE_UPLOAD){
    return next (new ErrorResponse(`Please upload a an image file less than 
        ${process.env.MAX_FILE_UPLOAD}`,400))
  }

  const filename = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${filename}`, async(err) =>{
    if(err){
      return next(new ErrorResponse(`Problem with file upload`, 500))
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, {
      photo: filename
    })

    res.status(200).json({
      success: true,
      data: filename
    })

  })

});

