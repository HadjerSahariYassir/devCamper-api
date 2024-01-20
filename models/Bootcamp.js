const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');

const BootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxLength: 20
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxLength: [500, 'Description can not be more than 500']
    },
    Website: {
     type: String,
     match: [
        'https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*'
        ,
         "Please add valid URL with HTTP or HTTPS"
     ]
    },
    phone: {
        type: String,
        maxLength: [20, 'Phone number can not be longer than 20 Characteres']
    },
    email: {
        type: String,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid Email'
        ]
    },
    address: {
        type: String,
       // required: [true, 'Please add an address']
    },
    location: {
        //GeoJson point
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: false
          },
          coordinates: {
            type: [Number],
            required: false,
            index: "2dsphere"
          },
          formattedAddress: String,
          street: String,
          city: String,
          state: String,
          zipcode: String,
          country: String
          
    },
    formatedAddress: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    careers: {
        //array
        type: [String],
        required: true,
        enum: [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other'
        ]
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating must can not be more than 10'],
    },
    averageCost: {
        type: Number,
    },
    housing: {
        type: Boolean,
        default: false
    },
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    jobAssistance: {
        type: Boolean,
        default: false
    },
    jobGuarantee: {
        type: Boolean,
        default: false
    },
    acceptGi: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})



BootcampSchema.pre('save', function(next){
    console.log("we are inside slug", this.name);
    this.slug = slugify(this.name, {lower: true})
    next();
})

//Geocode & create location field
/*BootcampSchema.pre('save', async function(next){
    const loc = await geocoder.geocode(this.address);
    console.log('loc', loc)
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress, 
        street: loc[0].streetName,
        city: loc[0].city,  
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        county: loc[0].countryCode 
    }
    //Do not save address in DB
    this.address = undefined;
    next();
})*/

// Remove courses of the deleted bootcamp
BootcampSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    await this.model('Course').deleteMany({ bootcamp: this._id});
    console.log(" delete course when bootcamp" )
    next();
})
// Reverse populate with virtuals
BootcampSchema.virtual('courses', {
    ref: 'Course',
    localField: '_id',
    foreignField: 'bootcamp',
    justOne: false
}) 


module.exports = mongoose.model('Bootcamp', BootcampSchema);