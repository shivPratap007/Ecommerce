const mongoose=require('mongoose');

const database=async function(ConnectionString){
    try{
        const data=await mongoose.connect(ConnectionString);
        console.log('Database connected');

    }
    catch(error){
        console.log(error);
    }
}

module.exports=database;