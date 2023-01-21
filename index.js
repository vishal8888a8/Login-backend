require('dotenv').config()
const express = require('express');
const path = require('path')
const hbs = require('hbs')
const bcrypt = require('bcryptjs');
const cookie_parser = require('cookie-parser');

const RegisterData = require('./src/models/schema')
const connectDB = require('./src/db/connection')
const auth = require('./src/middleware/auth')

connectDB();
const app = express();
 
const static_path = path.join(__dirname,'./public')
const template_path = path.join(__dirname,'./templates/views')
const partial_path = path.join(__dirname,'./templates/partials')

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(express.static(static_path));
app.use(cookie_parser())
app.set('view engine','hbs');
app.set('views',template_path);
hbs.registerPartials(partial_path)

app.get('/',auth,(req,res)=>{ 
    res.render('index')
})

app.get('/reg',(req,res)=>{ 
    res.render('reg')
})

app.post('/reg',async(req,res)=>{ 
    try{
        let addDb = await new RegisterData(req.body)

        //auth jwt middleware method of an instance
        let token = await addDb.getToken();

        // putting cookie in through response
        res.cookie('jwt',token,{
            // expires:new Date(Date.now()+300000),
            httpOnly:true
        })

        await addDb.save();
        res.send("Registration successfull!")
    }catch(err){
        res.status(400).send(err)
    }
})


app.post('/login',async(req,res)=>{
    try{
        let findDB = await RegisterData.findOne({email:req.body.email});
        if ( await bcrypt.compare( req.body.password, findDB.password) )
            {
                // genrating token if data valid
                let token = await findDB.getToken();

                res.cookie('jwt',token,{
                    expires:new Date(Date.now()+50000),
                    httpOnly:true
                }).send("Login!")
            }
        else
            res.send("Incorrect password!")
    }catch(err){
        res.send('Email not found!'+err)
    }
})

app.listen(process.env.PORT||3000,()=>console.log('server running!'))

