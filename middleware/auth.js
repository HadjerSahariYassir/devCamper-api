

const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect  =  asyncHandler(async(req, res, next) => {
    let token;
    console.log("jjdjdj yess")
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){

       token = req.headers.authorization.split(' ')[1];
       console.log('jfffff')
        // check if it is the corrected token
     }
     if(!token){
        return next (new ErrorResponse(`your are not authorotize to access this route`, 401))
     }
    // verify token
    try{
        console.log('hhhhhhhhhhhhhhhhhhh')
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('decoed', decoded);
        req.user = await User.findById(decoded.id);
        console.log('req user', req.user)
        next();
    }catch{
        return next (new ErrorResponse(`your are not authorotize to access this route`, 401))
    }

})
    
exports.authorize = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new ErrorResponse(
            `User role ${req.user.role} has no access to this route`,
            403
          )
        );
      }
      next();
    };
  };