const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const schema = new mongoose.Schema({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:[true, "Email already registered"]
    },
    password:{
        type:String,
        required:true
    },
    tokens:[{
        token:String
    }]
})

//Custom middle using method of instance for reg
schema.methods.getToken = async function(){
    try {
        let token = jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({token})
        return token;
    } catch (error) {
        console("error generating token "+error);
    }
}

//middleware before save
schema.pre('save',async function(next){
    if ( this.isModified('password') ){
        this.password = await bcrypt.hash(this.password,10);
    }
    next();  //ensure next middleware is executed
}) 

const RegisterData = new mongoose.model('RegisterCol',schema)
module.exports = RegisterData;