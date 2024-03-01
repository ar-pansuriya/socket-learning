const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    userName:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
    gender:{
        type:String,
        enum:['male','female'],
        required:true
    },
    profilePic:{
        type:String,
        default:'',
    },
});


const User=  mongoose.model("User",userSchema);

module.exports=  User;