const express = require("express")
const router = express.Router() 
const {registerUser, 
    logoutUser, 
    loginUser, 
    refreshAccessToken, 
    getCurrentUser, 
    updateUserCoverImage, 
    getUserChannelProfile, 
    getWatchHistory, 
    changeCurrentPasword, 
    updateAccountDetails,
     updateUserAvatar} = require("../controllers/user.controller.js") 

const upload = require("../middlewares/multer.middleware.js")
const verifyJWT = require("../middlewares/auth.middleware.js")



router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount: 1
        },
        {
            name:"coverImage",
            maxCount: 1
        }
    ]),
    registerUser)


router.route("/login").post(loginUser) 


//secured routes
router.route("/logout").post(verifyJWT, logoutUser)

//write an article on what is difference bw access token and refresh token
// on hashnode platform
router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password").post(verifyJWT, changeCurrentPasword)

router.route("/current-user").get(verifyJWT, getCurrentUser)

router.route("/update-account").patch(verifyJWT, updateAccountDetails)

router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)

router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage )

router.route("/c/:username").get(verifyJWT, getUserChannelProfile)

router.route("/history").get(verifyJWT, getWatchHistory)

module.exports = router 