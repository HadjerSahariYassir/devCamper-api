const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

//Load env vars
dotenv.config({ path: './config/config.env'});

// Load models 
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');
const User = require('./models/User');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
})

//Read JSON FILES
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}\\_data\\bootcamps.json`, 'utf8'));
const courses = JSON.parse(fs.readFileSync(`${__dirname}\\_data\\courses.json`, 'utf8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}\\_data\\users.json`, 'utf8'));

//Import into DB
const importData = async() => {
    try{
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        await User.create(users);
        console.log('data imported'.green.inverse);
        process.exit();
    }catch(err){
        console.log(err);
    }
}

//Delete Data
const deleteData = async() => {
    try{
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        await User.deleteMany();
        console.log('data destroyed'.red.inverse);
        process.exit();
    }catch(err){
        console.log(err);
    }
}

if(process.argv[2] === "-i"){
    importData();
}else if(process.argv[2] === "-d"){
    deleteData();
}