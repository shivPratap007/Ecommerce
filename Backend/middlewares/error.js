const ErrorHandler = require("../utils/errorHandeling");


module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode || 500;
    err.message=err.message || "Internal Server error";
    // Ye done ErrorHandler class se ayye hai fir bhi hum values me dobara values isliye daal rahe hai kyuki ager values nahi ayye to or vali values to chal jayengi

    if(err.name=="CastError"){
        const message=`Resource not found, Invalid ${err.path}`;
        err=new ErrorHandler(message,400);
    }

    // // Error for duplicate entry in mongodb
    // if(err.code ==1100){
    //     const message=`Duplicate ${Object.keys(err.keyValue)} entered`;
    //     err=new ErrorHandler(message,400);
    // }

    // // Wrong JWT error
    // if(err.name='JsonWebTokenError'){
    //     const message='Json web token is invalid please try later';
    //     err=new ErrorHandler(message,400);
    // }
    
    // // Token error
    // if(err.name='TokenError'){
    //     const message='Json web token in expired please try again';
    //     err=new ErrorHandler(message,400);
    // }
    res.status(err.statusCode).json({
        status:false,
        message:err.stack,
    })
}