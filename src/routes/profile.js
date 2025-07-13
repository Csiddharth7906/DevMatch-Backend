const express = require("express");
const profileRouter = express.Router();

const {userAuth} = require('../middleware/auth');

profileRouter.get("/profile" ,userAuth, async (req, res) => {
    try {
    const user=req.user;
    res.send(user);
    } catch (error) {
       res.status(401).send(error.message);
    }
    
    })  
    


module.exports = profileRouter;