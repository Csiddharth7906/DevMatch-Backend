const express = require("express");
const { userAuth } = require("../middleware/auth");
const userRouter = express.Router();
const connectionRequest = require("../models/connectionRequest")
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";
//Get all the pending connection request for the LoggedIn user
userRouter.get("/user/requests/received",userAuth, async (req,res)=>{
    try {
        const loggedInUser = req.user;
        const connectionRequests = await connectionRequest.find({
            toUserId : loggedInUser._id,
            status: "interested"
         }).populate("fromUserId", USER_SAFE_DATA);
          
        res.status(200).json({
            message: "Connection requests received successfully",
            data: connectionRequests
        }); 
          
    } catch (err) {
        res.status(400).send("Error: "+err.message)
    }
});  
//Get all the sent connection request for the LoggedIn user
userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await connectionRequest.find({
          $or: [
                { fromUserId: loggedInUser._id ,status: "accepted"},
                { toUserId: loggedInUser._id ,status: "accepted"}
            ]  
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);

        const data = connectionRequests.map((row )=>{ 
            if(row.fromUserId._id.equals(loggedInUser._id)){
               return row.toUserId
            
            }
        
                return   row.fromUserId
            
        });
        res.json({
            data: data
        });
    } catch (err) {
        res.status(400).send("Error: " + err.message)
    }
});

module.exports = userRouter;