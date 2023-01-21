const mongoose = require('mongoose');

const connectDB = ()=>{
    mongoose.set('strictQuery', false);
    mongoose.connect('mongodb://127.0.0.1:27017/user',()=>console.log("Database connected!"))
}

module.exports = connectDB;