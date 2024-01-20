const Course = require('../models/Course');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');

//@desc     Get all courses
//@route    Get /api/v1/courses
//@route    Get /api/v1/bootcamps/:bootcampId/courses 
//@access   Public 
exports.getCourses = asyncHandler(async(req, res, next) => {

    if(req.params.bootcampId){
        const courses = Course.find({ bootcamp: req.params.bootcampId})
        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses,
        })
    }else {
        res.status(200).json(res.advancedResults)  
    }

})

//@desc  Get a single course
//@route Get /api/v1/courses/:id
//@access Public 
exports.getCourse = asyncHandler(async(req, res, next) => {

    const course = await Course.findById({ _id: req.params.id}).populate({
            path: 'bootcamp',
            select: 'name description'
        });
    
    if(!course){
       return next(new ErrorResponse(`no course with the id of ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        data: course
    })  
})

//@desc  Add a single course
//@route POST /api/v1/bootcamps/:bootcampId/courses
//@access Private 
exports.addCourse = asyncHandler(async(req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    let bootcamp;
    if(req.params.bootcampId){
        bootcamp = Bootcamp.findById({ _id: req.params.bootcampId}); 
    }
    if(!bootcamp){
        return next(new ErrorResponse(`no bootcamp with the id of ${req.params.bootcampId}`, 404))
    }
    const course = await Course.create(req.body)
    res.status(200).json({
        success: true,
        data: course
    })  
})

//@desc  Edit a course
//@route PUT /api/v1/courses/:id
//@access Private 
exports.updateCourse = asyncHandler(async(req, res, next) => {
    let course;
    course = await Course.findById({ _id: req.params.id}); 
    if(!course){
        return next(new ErrorResponse(`no course with the id of ${req.params.id}`, 404))
    }
     course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        runValidators: true,
        new: true
     })
    
    res.status(200).json({
        success: true,
        data: course
    })
})


//@desc delete a course
//@route DELETE /api/v1/courses/:id
//@access Private 
exports.deleteCourse = asyncHandler(async(req, res, next) => {
    
    const course = await Course.findById({ _id: req.params.id}); 
    if(!course){
        return next(new ErrorResponse(`no bootcamp with the id of ${req.params.id}`, 404))
    }
    await Course.deleteOne({_id: req.params.id})
    res.status(200).json({
        success: true,
        data: course
    })

})

