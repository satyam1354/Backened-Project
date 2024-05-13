const asyncHandler = require("../utils/asyncHandler")
const ApiError = require("../utils/ApiErrors.js")
const jwt = require("jsonwebtoken")
const User = require("../models/user.model.js")

   // res can be written as "_" if it is not used
const verifyJWT = asyncHandler( async (req, _, next)=>{
try {
    const token = req.cookies?.accessToken  || req.header("Authorization"?.replace("Bearer ",""))
    
    if(!token){
        throw new ApiError(401, "Unauthorized request")
    }
    
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
    const user = await User.findById(decodedToken?._id).select
    ("-password -refreshToken")
    
    if(!user){
        //TODO: discuss about frontend
        throw new ApiError(401, "Invalid Access Token")
    }
    
    req.user = user;
    next ()

} catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token")
}

})

module.exports = verifyJWT