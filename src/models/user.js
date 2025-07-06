const mongoose = require("mongoose");

const userSchema =  new mongoose.Schema({
    firstName: {
        type : String,
        required:true,
        minlength:3,
        maxlength:50,
        
    },
    lastName: {
        type : String,
    },
    email: {
        type :String,
        required:true,
        unique:true,
        lowercase: true,
        trim: true,
    
    },
    password: {
        type : String,
        required:true,
    },
    age:{
        type : Number,
        min:18,
        
          
    },
    gender:{
        type : String,
        validate(value){
            const validGenders = ["Male", "Female", "Other"];
            if(!validGenders.includes(value)){
                throw new Error("Invalid gender");
            }
        }
    },
    photoUrl:{
        type : String,
         default: "https://geographyandyou.com/images/user-profile.png",
    },
    about:{
        type : String,
        default: "I am a passionate developer ",
    },
    skills:{
        type : [String],
    }


},{ timestamps: true });

module.exports = mongoose.model("User", userSchema);