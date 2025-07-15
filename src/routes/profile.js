const express = require("express");
const profileRouter = express.Router();
const validateProfileEdit = require("../utils/validation")
const {userAuth} = require('../middleware/auth');

profileRouter.get("/profile/view" ,userAuth, async (req, res) => {
    try {
    const user=req.user;
    res.send(user);
    } catch (error) {
       res.status(401).send(error.message);
    }
    
    });

profileRouter.patch("/profile/edit",userAuth ,async(req,res)=>{
   try {
    if(!validateProfileEdit(req)){
        throw new Error("Invalid Edit Request")
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]));
    await loggedInUser.save();
    res.send(`${loggedInUser.firstName} is updated his data`)
   } catch (err) {
     res.status(400).send("Error"+err.message)
   }
})
   



module.exports = profileRouter;