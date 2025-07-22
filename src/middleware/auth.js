const jwt = require('jsonwebtoken');
const User = require('../models/user');
const userAuth =async (req,res,next)=>{
 //Read the token from the request header
 try{
  const {token} = req.cookies;
 if(!token){
   throw new Error('No token found');
 }
 const decodedObject = jwt.verify(token, process.env.JWT_SECRET);
 const {id} = decodedObject;
 const user = await User.findById(id);
 if(!user){
   throw new Error('Unauthorized access');
 }
   req.user=user;
   next();
  }
   catch(err){
   res.status(401).send(err.message);
 }
 

};

module.exports ={userAuth}