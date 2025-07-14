const express = require("express");
const validateSignUpData = require("../utils/validation");
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');


const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
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

    await user.save();
    res.send("User has been created successfully");
  } catch (err) {
    res.status(400).send("ERROR : " + err);
  }
});
 
authRouter.post("/login", async (req, res) => {
  try{
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
      res.cookie('token', token, {  expires: new Date(Date.now() + 8 * 3600000)} );
    
       res.send("Logged In successfully");
     }else{
      throw new Error("Password is incorrect");
     }
  } catch(err){
    res.status(400).send("Invalid credentials");
  }
})
authRouter.post("/logout", async (req,res) =>{
  res.cookie("token",null,{
    expires: new Date(Date.now())
  })

  res.send("Logout gullu");
})

module.exports = authRouter;