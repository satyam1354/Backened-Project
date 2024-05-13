const mongoose = require('mongoose')
//const { DB_NAME } = require("./constants.js")


const connectDB = async()=>{
   try{
   const connectionInstance =  await mongoose.connect
         ('mongodb://localhost:27017/videotube')
        // ('mongodb+srv://satyam:satyam@cluster0.np2uebs.mongodb.net/videotube')
        //(`${process.env.MONGODB_URI}/${DB_NAME}`)
     console.log(`\n MongoDB connected !! DB HOST:${connectionInstance.connection.host}`);
   }catch(error){
      console.log("MONGODB connection FAILED ",error);
      process.exit(1)
   } 
}

// export default connectDB; 
module.exports = connectDB;       