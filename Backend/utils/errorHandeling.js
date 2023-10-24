class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this,this.constructor); // It is used to get al
    }
}

module.exports=ErrorHandler;

