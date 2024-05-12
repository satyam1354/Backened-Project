//require('dotenv').config({path: './env'})
const dotenv = require("dotenv")

// const express = require('express')
// const app = express()
const app = require("./app.js")

const connectDB = require("./db/index.js")

dotenv.config({
    path:'./.env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, (err)=>{
      if(err)
        console.log("errored occured in listening : ",err);
      else
         console.log(`Server is running at port : ${process.env.PORT}`);

    })
})
.catch((err)=>{
    console.log("MONGO db connection failed !!! ",err)
})

 

//simple way  to connect database in index.js page but we choose different way of another folder db
/*
// const mongoose = require('mongoose')
// const { DB_NAME } = require("./constants")
const express = require("express")
const app = express()

( async () =>{
    try{
         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
         app.on("error",(error)=>{
         console.log("ERROR: ",error);
          throw error;
         })

        app.listen(process.env.PORT , ()=>{
            console.log(`App is listening on port $
                 {process.env.PORT}`);
        }) 
    } catch(error){
       console.error("ERROR: ",error)
       throw err
    }
})()
*/

