const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "Please add a name"]
    },
  
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      match: [
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please use valid email"
      ]
    },
  
    role: {
      type: String,
      enum: ["user", "publisher"],
      default: "user"
    },
  
    password: {
      type: String,
      required: [true, "Please input a password"],
      minlength: 6,
      select: false
    },
  
    resetPasswordToken: String,
    resetPasswordExpiration: Date,
    createdAt: {
      type: Date,
      default: Date.now
    }
  });


UserSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(10);
    console.log("salt", salt);
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.getSignedJwtToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRE})
}

UserSchema.methods.matchPassword = function(password){
    return bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('User', UserSchema);