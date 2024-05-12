 const fs = require("fs")
 const cloudinary = require('cloudinary').v2;

 //import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (localFilePath) =>{
    try{
        if(!localFilePath) return null;
        //upload the file on cloudinary
       const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        //file has been uploaded success..
        console.log("file  is uploaded on cloudinary")
        console.log(response)
        console.log(response.url)
        return response
    } catch(error) {
         fs.unlinkSync(localFilePath) //remove the locally saved temporary file
         //as the upload operatino got failed
         return null;
    }
}

//same executed above
// cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" }, 
//   function(error, result) {console.log(result); });

module.exports  ={uploadOnCloudinary}