const asyncHandler = require("../utils/asyncHandler")
const ApiError = require("../utils/ApiErrors.js")
const User = require("../models/user.model.js")
const uploadOnCloudinary = require("../utils/cloudinary.js")
const ApiResponse = require('../utils/ApiResponse.js')


// const registerUser = asyncHandler(async (req,res)=>{
//      res.status(200).json({
//         message:"ok"
//     })
// })

const registerUser = asyncHandler(async (req,res)=>{
   //get user details from frontend
   //validation -- not empty
   //check if user already exists: username , email
   //check for images , check for avatar
   // upload them on cloudinary ,avatar check
   //create user object - create entry in db
   // remove password and refresh token field from response
   //check for user creation ? 
   // ? return res : return error
    

   const {fullname,email,username,password } = req.body
   console.log("email:", email)
   console.log(req.body)
  
    // if(username==="") {
    //     throw new ApiError(400,"fullname is required")
    // }   //  here we can each fieldname using if and elseif condition

    if(
        [fullname,email,username,password].some((field)=>
            field?.trim() === "" )
    ){
       throw new ApiError(400,"All fields are required")
        }
      
     const existedUser = User.findOne({
        $or: [{ username }, { email:email }]
    })   
    console.log(existedUser)
    if(existedUser) {
        throw new ApiError(409 , "user with username or email already exists")
    }
   
    console.log(req.files)
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    
    if(!avatarLocalPath){
         throw new ApiError(400 , "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
 
     if(!avatar){
        throw new ApiError(400 , "Avatar file is required")
     }

     const user = await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
     })

     const checkedUser = await User.findById(user._id).select(
        "-password -refreshToken"
     )
   
    if(!checkedUser){
        throw new ApiError(500, "something went wrong while registering the user")
    }

   return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered Successfully")
   )
       

})


module.exports  = registerUser
//exports = registerUser