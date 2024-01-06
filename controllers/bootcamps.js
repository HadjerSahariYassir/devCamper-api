const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
//@desc     Get all bootcamps
//@route    Get /api/v1/bootcamps
//@access   Public
exports.getBootCamps = async(req, res, next) => {
  try{
    const bootcamps = await Bootcamp.find();
    res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps
    })
  }catch(err){
    res.status(500).json({
      success: false
    })
  }
};

//@desc     Get single bootcamps
//@route    Get /api/v1/bootcamps/:id
//@access   Public
exports.getBootCamp = async(req, res, next) => {
  try{
    const bootcamp = await Bootcamp.findById(req.params.id);
    if(!bootcamp){
      return next (new ErrorResponse(`Bootcamp not found with id (not in database)${req.params.id}`, 404))
    }
    res.status(200).json({
      success: true,
      data: bootcamp
    })
  }catch(err){
    /*res.status(400).json({
      success: false
    })*/
    next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404));
  }
};

//@desc     Create new bootcamp
//@route    POST /api/v1/bootcamps
//@access   Private
exports.createBootCamp = async(req, res, next) => {
  try{
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      data: bootcamp
    })
    res.status(201).send({ success: true, msg: "create a  new bootcamp" });
  }catch(err){
    res.status(400).json({
      success: false
    })
  }
};

//@desc     Update single bootcamps
//@route    PUT /api/v1/bootcamps/:id
//@access   Private
exports.updateBootCamp = async(req, res, next) => {
  try{
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }); 
    if(!bootcamp){
      return res.status(400).json({
        success: false
       })
    }
    res.status(200).json({
      success: true,
      data: bootcamp
    })
  }catch(err){
    res.status(400).json({
      success: false
    })
  }
}
//@desc     Delete single bootcamps
//@route    DELETE /api/v1/bootcamps/:id
//@access   Private
exports.deleteBootCamp = async(req, res, next) => {
  try{
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if(!bootcamp){
      return res.status(400).json({
        success: false
       })
    }
    res.status(200).json({
      success: true,
      data: bootcamp
    })
  }catch(err){
    res.status(400).json({
      success: false
    })
  }
};
