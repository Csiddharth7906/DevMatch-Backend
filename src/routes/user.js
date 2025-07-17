const express = require("express");
const { userAuth } = require("../middleware/auth");
const userRouter = express.Router();
const connectionRequest = require("../models/connectionRequest")
//Get all the pending connection request for the LoggedIn user
userRouter.get("/user/reques/received",userAuth, async (req,res)=>{
    try {
        const loggedInUser = req.user;
        const connectionRequests = await connectionRequest.find({
            toUserId : loggedInUser._id,
            status: intersted
         })
    } catch (err) {
        res.status(400).send("Error: "+err.message)
    }
})
module.exports = userRouter;