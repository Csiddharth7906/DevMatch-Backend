const express = require("express");
const validateSignUpData = require("../utils/validation");
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');


const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
  const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https';
    //validation of data
    validateSignUpData(req);
    const { firstName, lastName, email, password } = req.body;
    //encrypt the passsword
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    // Save the user to the database

   const savedUser = await user.save();
   const token = await savedUser.getJWT();
  res.cookie('token', token, {
  httpOnly: true,
  secure: isSecure, // true if HTTPS, false if HTTP (local)
  sameSite: isSecure ? 'None' : 'Lax',
  expires: new Date(Date.now() + 8 * 3600000)
});
    res.json({message:"User has been created successfully",data:savedUser});
  } catch (err) {
    res.status(400).send("ERROR : " + err);
  }
});
 
authRouter.post("/login", async (req, res) => {
  try{
    
  const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https';
     const {email,password} = req.body;
     const user = await User.findOne({email: email});
  
     if(!user){
       res.status(404).send("invalid credentials");
     }
     const isPasswordValid =   await user.validatePassword(password);
     if(isPasswordValid){
      
      //Create and sign a JWT token
      const token = await user.getJWT();
      
      //Add the token to cookie and send the response back to the client
    res.cookie('token', token, {
     httpOnly: true,
     secure: isSecure, // true if HTTPS, false if HTTP (local)
      sameSite: isSecure ? 'None' : 'Lax',
     expires: new Date(Date.now() + 8 * 3600000)
    });
    
       res.send(user);
     }else{
      throw new Error("Password is incorrect");
     }
  } catch(err){
    res.status(400).send("Invalid credentials");
  }
})
authRouter.post("/logout", async (req,res) =>{
   const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https';
    res.cookie("token",null,{
     httpOnly: true,
     secure: isSecure, // true if HTTPS, false if HTTP (local)
      sameSite: isSecure ? 'None' : 'Lax',
    expires: new Date(Date.now())
  })

  res.send("Logout gullu");
})


module.exports = authRouter;