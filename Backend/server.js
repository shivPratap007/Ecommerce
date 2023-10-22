const app=require('./app');

// Port variable
const port=require("./config/envVariable") || 7000;


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})