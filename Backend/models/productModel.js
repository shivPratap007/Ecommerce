const mongoose=require('mongoose');

const product=new mongoose.Schema({
    Name:{
        type:String,
        required:true,
    },
    Description:{
        type:String,
        required:true,
    },
    Price:{
        type:Number,
        required:true,
        maxlength:8,
    },
    Rating:{
        type:Number,
        default:0,
    },
    Image:[
        {
            PublicID:{
                type:String,
                required:true,
            },
            URL:{
                type:String,
                required:true,
            }
        }
    ],
    Category:{
        type:String,
        required:true,
    },
    Stock:{
        type:Number,
        required:true,
        maxlength:4,
        default:1,
    },
    Reviews:[
        {
            Name:{
                type:String,
                required:true,
            },
            Rating:{
                type:String,
                required:true,
            },
            Comment:{
                type:String,
                required:true,
            }
        }
    ]

},{timestamps:true});

const productModel=mongoose.model("product",product);

module.exports=productModel;