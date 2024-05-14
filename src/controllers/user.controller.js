const asyncHandler = require("../utils/asyncHandler")
const ApiError = require("../utils/ApiErrors.js")
const User = require("../models/user.model.js")
const uploadOnCloudinary = require("../utils/cloudinary.js")
const ApiResponse = require('../utils/ApiResponse.js')
const jwt = require('jsonwebtoken')

const mongoose = require("mongoose")
//const bcrypt = require('bcrypt')


const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        //console.log(user)


        user.refreshToken = refreshToken  //saving refresh token in db
        await user.save({ validateBeforeSave: false })

        return (accessToken, refreshToken)
 

    } catch (error) {
        throw new ApiError(500, "something went wrong while generating refresh and access token")
    }
}
//---------------------------------------------------------

// const registerUser = asyncHandler(async (req,res)=>{
//      res.status(200).json({
//         message:"ok"
//     })
// })

const registerUser = asyncHandler(async (req, res) => {
    //get user details from frontend
    //validation -- not empty
    //check if user already exists: username , email
    //check for images , check for avatar
    // upload them on cloudinary ,avatar check
    //create user object - create entry in db
    // remove password and refresh token field from response
    //check for user creation ? 
    // ? return res : return error


    const { fullname, email, username, password } = req.body
    //    console.log("email:", email)
    //    console.log(req.body)

    // if(username==="") {
    //     throw new ApiError(400,"fullname is required")
    // }   //  here we can each fieldname using if and elseif condition

    if (
        [fullname, email, username, password].some((field) =>
            field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email: email }]
    })
    console.log("existed user : "+ existedUser)

    if (existedUser) {
        throw new ApiError(409, "user with username or email already exists")
    }

    console.log(req.files)

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    // let coverImageLocalPath;
    // if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    //     coverImageLocalPath = req.files.coverImage[0].path;
    // }


    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }
    //  console.log(avatarLocalPath)
    //  console.log(coverImageLocalPath)


    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath) // if there is no cove image then cloudinary returns empty string

    console.log("avatar :" + avatar)
    console.log("coverImage :" + coverImage)

     if(!avatar){
        throw new ApiError(400 , "Avatar file is required!!!")
     }
 console.log("------------everything verified-------------")
    const user = await User.create({
        fullname,
        avatar: avatar?.url,// || "",
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    console.log("user created success")

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

})

//---------------------------------------------------------------------
const loginUser = asyncHandler(async (req, res) => {
    //req body -> data 
    //username or email
    //find the user
    //password check
    //access and refresh token  generated
    // send tokens in cookies 

    const { email, username, password } = req.body
       

    // if (!username && !email) {     // if we need both for checking
    //     throw new ApiError(400, "username and email is required")
    // }
  //heere it is an alternative of above code based on logic to be applied of to  be checking any one of them 
   if (!(username || email)) {
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({   //findOne() method returns a query, not the actual user document. You need to await the execution of the query to get the user document.
        $or: [{ username }, { email }]
    })
       // console.log(user)   // it should not be in query format but in document format(user document )

 
    if (!user) {
        throw new ApiError(404, "User does not exist")
    }
 
    const isPasswordValid = await user.isPasswordCorrect(password);
    console.log("pass: " ,isPasswordValid)


    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credential -> password")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)
    console.log(accessToken, refreshToken)  //?undefined

 
    const loggedInUser = await User.findById(user._id).
        select("-password -refreshToken")


    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken,
                    refreshToken
                },
                "User logged in successfully"
            )
        )
}) 

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if(!incomingRefreshToken){
      throw new ApiError(401, "unauthorised request")
    }
   
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if(!user) {
            throw new ApiError(401, "invalid  refresh token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }
    
        const options ={
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newrefreshToken} = await generateAccessAndREfreshTokens(user._id)
       
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newrefreshToken, options)
        .json(
             new ApiResponse(
                200,
                {accessToken, refreshToken: newrefreshToken},
                "Access token refreshed"
             )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }


}) 

module.exports = {registerUser, loginUser, logoutUser, refreshAccessToken}
//exports = registerUser 