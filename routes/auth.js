
const router = require("express").Router()
const userSchema = require("../models/Auth")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Error, Success } = require("../Utils/responseWrap");
const middleware = require("../middleware/middleware");
const { body, validationResult } = require('express-validator');



//! signup user

router.post("/signup",[
    body('name', "name must be maximum 10 char").isLength({ max: 10 }),
    body('email', "Enter a valid email").isEmail(),
    // password must be at least 5 chars long
    body('password', "password should be atleast 5 char").isLength({ min: 5 }),
],async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(Error(errors.array(),400));
    }

    const {name, email, password} = req.body
    if(!name || !email || !password){
        return res.json(Error("All field are required",404))
    }

   try {
    const  salt =await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt)
    await userSchema.create({
        name,email,
        password:hashPass
    })
   
   return res.json(Success("user signup successfully",201))
   } catch (error) {
    return res.json(Error(error.message,400))
   }

})


//! login user

router.post("/login",[
    body('email', "Enter a valid email").isEmail(),
    // password must be at least 5 chars long
    body('password', "password should be atleast 5 char").isLength({ min: 5 }),
],async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(Error(errors.array(),400));
    }
    const { email, password} = req.body
    if(!email || !password){
        return res.json(Error("all field are required",400))
    }

   try {
   const user = await userSchema.findOne({email})
//    console.log(user)
   if(!user){
    return res.json(Error("you are not authenticated",400))
   }
   const isCorrectPassword = await bcrypt.compare(password,user.password)

   if(!isCorrectPassword){
    return res.json(Error("you are not authenticated",400))
   }
    
    const token = generateToken({_id:user._id})
    const refreshToken = generateRefreshToken({_id:user._id})
    

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true
    })
   
   return res.json(Success({token,message:"user is successfully login"},200))
   } catch (error) {
    return res.json(Error(error.message,400))
   }


})


router.get("/getmyprofile",middleware,async(req,res)=>{
     try {
        const user = await userSchema.findById(req.user._id).select("-password")
        return res.json(Success(user,200))
     } catch (error) {
        return res.json(Error("internal server error",500))
     }
})



 router.get("/refreshtoken",async (req, res) => {
        const cookies = req.cookies;
        if (!cookies.jwt) {
            // return res.status(401).send("Refresh token in cookie is required")
            return res.send(Error('Refresh token in cookie is required',401))
        }
        const refreshToken = cookies.jwt
        // console.log('ref', refreshToken)
        try {
            const token = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY)
            // console.log('tokenKey', token)
            const _id = token._id
            const accessToken = generateToken({ _id })
            // return res.status(201).json({ accessToken })
            // console.log("refresh", accessToken)
            return res.json(Success(accessToken,201))
        } catch (err) {
            // return res.status(401).send("Invalid access key")
            // console.log('error', err)
            return res.send(Error( 'Invalid access key',401))
        }
    }
 )


 router.post("/logout",async (req, res) => {
    try {
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: true
        })
        return res.send(Success("user logout success",200))
    } catch (e) {
        return res.send(Error(e.message,500))
    }
}) 



function generateToken(data){

    const token = jwt.sign(data,process.env.SECRET_TOKEN,{
         expiresIn: '10d' 
    })
    return token

}


function generateRefreshToken(data){
    const token = jwt.sign(data,process.env.REFRESH_TOKEN_KEY,{
        expiresIn: '1y' 
   })
   return token
}


module.exports = router