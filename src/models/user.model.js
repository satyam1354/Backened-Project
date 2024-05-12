//import mongoose, {Schema} from "mongoose";
//const userSchema = new Schema(  ..........

const mongoose = require("mongoose")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        fullname:{
            type:String,
            required:true,
            trim:true,
            index:true
        },
        avatar:{
            type:String,  //cloudinary url
            //required:true
        },
        coverImage:{
            type:String, //cloudinary url
        },
        watchHistory:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Video"
            }
        ],
        password:{
            type:String,
            required:[true,'Password is required']
        },
        refreshToken:{
            type:String
        }
    },
    {
        timestamps:true
    }
);

//pre hooks runs jsut before user schema
userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPassword  = async function
(password){
    return await bcrypt.compare(password , this.password)   //t  ya f
}

userSchema.methods.generateAccessToken = function(){
   return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id,
           
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPITRY
        }
    )
}




//export const User = mongoose.model("User",userSchema)
const User = mongoose.model("User",userSchema)
module.exports = User