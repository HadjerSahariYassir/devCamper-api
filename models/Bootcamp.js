const mongoose = require('mongoose');

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
        type: Number,
        maxLength: [20, 'Please add valid number']
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    location: {
        //GeoJson point
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
          },
          coordinates: {
            type: [Number],
            required: true,
            index: "2dsphere"
          }
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
    }
})

module.exports = mongoose.model('Bootcamp', BootcampSchema)