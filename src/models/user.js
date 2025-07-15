const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 50,
      
    },
    lastName: {
      type: String,
      
      maxlength: 50,
      validate(value) {
        const validNames = /^[a-zA-Z]+$/;
        if (!validNames.test(value)) {
          throw new Error("Invalid last name");
        }
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address");
        }
    }
    },
    password: {
      type: String,
      required: true,
      minlength: 4,
      validate(value) {
        if(!validator.isStrongPassword(value)){
            throw new Error("Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character");
        }
      }
    },
    age: {
      type: Number,
      min: 18,
      validate(value) {
        if (value <= 0) {
          throw new Error("Age must be a positive integer");
        }
      },
    },
    gender: {
      type: String,
      enum:{
        values:["male","female","others"],
        message:`{VALUE} is not valid gender type`
      }
    },
    photoUrl: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
      validate(value) {
        if(!validator.isURL(value)){
            throw new Error("Invalid photo URL");
        }
      }
    },
    about: {
      type: String,
      default: "I am a passionate developer ",
      minlength: 20,
      maxlength: 500,
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length > 10) {
          throw new Error("Skills list should not exceed 10 items");
        }
      },
    },
  },
  { timestamps: true } 
);
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ id: user._id }, "DEV@sid@123", { expiresIn: "7d" });
  return token;
};
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash =user.password;
  const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
  return isPasswordValid;
}
module.exports = mongoose.model("User", userSchema);