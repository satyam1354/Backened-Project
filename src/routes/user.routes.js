const express = require("express")
const router = express.Router() 
const registerUser = require("../controllers/user.controller.js") 


router.route("/register").post(registerUser)

module.exports = router 