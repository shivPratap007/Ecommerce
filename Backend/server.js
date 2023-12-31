const express = require("express");
const app = require("./app");
const database = require("./config/database");
const errorMiddleware=require("./middlewares/error");
const cookieParser=require('cookie-parser');



// HANDELING UNCAUGHT ERROR
process.on('uncaughtException',(error)=>{
  console.log(`Error: ${error.message}`);
  console.log('Shutting down the server due to uncaught error');
  process.exit(1);
})

// To accept json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// To accept cookie
app.use(cookieParser());






// Port variable
const port = require("./config/envVariable") || 7000;

// products route
const productRouter = require("./routes/productRoute");
app.use("/api/v1", productRouter);

// user route
const userRouter=require('./routes/userRoute');
app.use('/api/v1',userRouter);

// order route
const orderRouter=require('./routes/orderRoutes');
app.use('/api/v1/',orderRouter);

// Middleware for error
app.use(errorMiddleware);

database(process.env.DATABASE);

const application=app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Unhandeld promise rejections
process.on("unhandledRejection",(error)=>{
  console.log(`Error: ${error.message}`);
  console.log('Shutting down the server due to unhandeld promise rejections');
  application.close(()=>{
    process.exit(1);
  })
})

app.get("/api/v1/order/me",(req,res)=>{
  console.log("Running");
  res.json({
    status:true,
  })
})