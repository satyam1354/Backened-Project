//import express from "express"
const express = require("express")
const cors =require('cors')
const cookieParser = require('cookie-parser')

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,
    limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import
const userRouter = require('./routes/user.routes.js')

 
///routes declaration
app.use("/api/v1/users",userRouter)

app.get("/",(req,res)=>{
    res.send('little bit working')
})
app.get("*",(req,res)=>{
    res.send('undefined-wrong  url')
})

//export { app }
module.exports = app;