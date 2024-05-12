const multer = require('multer')

const storage = multer.diskStorage({
    destination:function (req,file,cb){
        //console.log("file: " + file.filename)
        cb(null,  './public/temp')
    },
    filename:(req,file,cb)=>{
            //console.log("filename: " + file.originalname)
        // const uniqueSuffix = Date.now() + '_' + Math.round(Math.random()*1E9)
        // cb(null,file.fieldname+ '_' + uniqueSuffix)
        cb(null,file.originalname)
    }
})


const upload = multer({storage:storage})

module.exports  = upload