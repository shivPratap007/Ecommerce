const express=require('express');
const app=require('./app');
const database=require('./config/database');

// Port variable
const port=require("./config/envVariable") || 7000;

// products route
const productRouter=require('./routes/productRoute');
app.use('/api/v1',productRouter);

// To accept json
app.use(express.json());




database(process.env.DATABASE);


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})