const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc    Current logged in user
// @route   POST /api/v1/auth/register
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);
     res.status(200).json({ success: true , data: user});
  });


exports.registerUser = asyncHandler(async(req, res, next) => {
    const { name, email, password, role} = req.body;
    //create User
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    sendTokenResponse(user, 200, res); //call cookie fct
})


exports.loginUser = asyncHandler(async(req, res, next) => {
    const { email, password } = req.body;
    
    if(!email || !password){
        return next (new ErrorResponse(`Please add the missed parameter`, 400))
    }
    //check email
    const user = await User.findOne({ email: email }).select('+password');
    if(!user){
        return next (new ErrorResponse(`Invalid cridentials`, 401))
    }
    //check password
    const isMatch = await user.matchPassword(password);
    if(!isMatch){
        return next (new ErrorResponse(`Invalid cridentials 2`, 401))
    }
    
    sendTokenResponse(user, 200, res); //call cookie fct
})


  
//Get token from Model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    //Create token
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24*60*60*1000),
        httpOnly: true
    }
    if(process.env.NODE_ENV === "production"){
        options.secure = true;
    }
    res.status(statusCode).cookie('token', token, options).json(
        {
            success: true,
            token,
        }
    )
}

