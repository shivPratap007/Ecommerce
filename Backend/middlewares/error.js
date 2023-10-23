
const ErrorHandler=require("../utils/errorHandeling");

module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode || 500;
    err.message=err.message || "Internal Server error";
    // Ye done ErrorHandler class se ayye hai fir bhi hum values me dobara values isliye daal rahe hai kyuki ager values nahi ayye to or vali values to chal jayengi

    res.status(err.statusCode).json({
        status:false,
        message:err.stack,
    })
}