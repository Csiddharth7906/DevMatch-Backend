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
      required: function() {
        return !this.googleId && !this.githubId;
      },
      minlength: 4,
      validate(value) {
        if(value && !validator.isStrongPassword(value)){
            throw new Error("Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character");
        }
      }
    },
    googleId: {
      type: String,
      sparse: true
    },
    githubId: {
      type: String,
      sparse: true
    },
    isEmailVerified: {
      type: Boolean,
      default: false
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
  default: "https://res.cloudinary.com/dnsiqvnii/image/upload/v1234567890/default_profile.png",
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
    github: {
      type: String,
      validate(value) {
        if (value && !validator.isURL(value)) {
          throw new Error("Invalid GitHub URL");
        }
      }
    },
    linkedin: {
      type: String,
      validate(value) {
        if (value && !validator.isURL(value)) {
          throw new Error("Invalid LinkedIn URL");
        }
      }
    },
    portfolio: {
      type: String,
      validate(value) {
        if (value && !validator.isURL(value)) {
          throw new Error("Invalid portfolio URL");
        }
      }
    },
    instagram: {
      type: String,
      validate(value) {
        if (value && !validator.isURL(value)) {
          throw new Error("Invalid Instagram URL");
        }
      }
    },
    twitter: {
      type: String,
      validate(value) {
        if (value && !validator.isURL(value)) {
          throw new Error("Invalid Twitter URL");
        }
      }
    },
    youtube: {
      type: String,
      validate(value) {
        if (value && !validator.isURL(value)) {
          throw new Error("Invalid YouTube URL");
        }
      }
    },
    website: {
      type: String,
      validate(value) {
        if (value && !validator.isURL(value)) {
          throw new Error("Invalid website URL");
        }
      }
    },
    location: {
      type: String,
      maxlength: 100
    },
    experience: {
      type: String,
      enum: {
        values: ["fresher", "0-1", "1-3", "3-5", "5-10", "10+"],
        message: "{VALUE} is not a valid experience level"
      }
    },
    isProfilePublic: {
      type: Boolean,
      default: true
    },
    githubRepos: {
      type: [{
        name: String,
        description: String,
        url: String,
        language: String,
        stars: Number,
        forks: Number,
        updatedAt: Date
      }],
      default: []
    },
    lastGithubSync: {
      type: Date
    }
  },
  { timestamps: true } 
);
userSchema.index({firstname: 1, lastName:1})
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