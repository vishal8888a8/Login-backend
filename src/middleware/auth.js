const jwt = require('jsonwebtoken');
const RegisterData = require('../models/schema')

const auth = async(req,res,next)=>{
    try {
        const token = req.cookies.jwt;
        const verify = jwt.verify(token,process.env.SECRET_KEY)
        const _id = verify._id
        const user = await RegisterData.findById({_id});
        console.log(user);
        res.send("Hello "+user.fname+" "+user.lname+" you have logged in!")
        // next();
    } catch (error) {
        console.log("there is error "+error);
    }
}

module.exports = auth;