//accepting(asyncHandler) as a function and returning as a function
const asyncHandler = (requestHandler) =>{
   return (req,res , next) =>{
    Promise.resolve(requestHandler(req,res,next))
    .catch((err)=> next(err))
   }  // chatgpt of promise.resolve later
} 

//export {asyncHandler}
module.exports = asyncHandler

//---------------------------

// const asyncHandler = () => {}
// const asyncHandler = () => () => {}
// const asyncHandler = (func) => async () => {}

// const asyncHandler = (fu) => async (req,res,next) => {
//     try{
//         await fn(req,res,next)
//     }catch(error){
//         res.status(err.code || 500).json({
//             success:false,
//             message:err.message
//         })
//     }
// }