 const fs = require("fs")
 const cloudinary = require('cloudinary').v2;

 //import {v2 as cloudinary} from 'cloudinary';
          
// cloudinary.config({ 
//   cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
//   api_key: process.env.CLOUDINARY_API_KEY, 
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });
cloudinary.config({ 
  cloud_name:"dfreyeg5j", 
  api_key: "291632113385653", 
  api_secret: "OqOKDw2V35nEi0OKUIqijfTZExk"
});


const uploadOnCloudinary = async (localFilePath) =>{
    try{
        if(!localFilePath) {   
                              return null;}
        //upload the file on cloudinary

        console.log(localFilePath)

       const response = await cloudinary.uploader.upload(localFilePath,{
           resource_type:"auto"
        })

        //file has been uploaded success..
        console.log("file  is uploaded on cloudinary")
        console.log(response)
        console.log(response.url)
        fs.unlinkSync(localFilePath)
        return response
    } catch(error) {
        //  fs.unlinkSync(localFilePath) //remove the locally saved temporary file as the upload operatino got failed
         console.log("returning null in catch") 
         return null; 
    } 
}

//same executed above temporary code
// cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" }, 
//   function(error, result) {console.log(result); });

module.exports  = uploadOnCloudinary