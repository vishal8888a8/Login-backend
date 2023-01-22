const jwt = require('jsonwebtoken');
const RegisterData = require('../models/schema')

const auth = async(req,res,next)=>{
    try {
        const token = req.cookies.jwt;
        const verify = jwt.verify(token,process.env.SECRET_KEY)
        const _id = verify._id
        const user = await RegisterData.findById({_id});

        //storing data
        req.user = user;
        req.token = token;

        // res.send("Hello "+user.fname+" "+user.lname+" you have logged in!")
        next();  // if we do next control reaches back to the of function
    } catch (error) {
        res.send("you got an error " + error)
    }
}

module.exports = auth;