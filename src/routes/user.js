const express = require("express");
const { userAuth } = require("../middleware/auth");
const userRouter = express.Router();
const User = require("../models/user");
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
          
        res.json({
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
//Get all the feed api data for the logged in user
userRouter.get("/feed", userAuth, async (req, res) => {
    try{
       
         const loggedInUser = req.user;
         const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit>50 ? 50 : limit; // Limit the maximum number of users to 50
         // Calculate the number of documents to skip based on the page number and limit
        const skip = (page-1) * limit;
         //find all connection request (sent + recived)
         const connectionRequests = await connectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
         }).select("fromUserId toUserId")
         const hideUsersFromFeed = new Set();
         connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
         });
         const users = await User.find({
            $and : [
                { _id : { $nin: Array.from(hideUsersFromFeed) }},// Exclude users who are in connection requests array from the feed 
                { _id : { $ne: loggedInUser._id }}// Exclude the logged in user from the feed
         ]   
         }) .select(USER_SAFE_DATA).skip(skip).limit(limit);

     res.json({data:users});

    }catch(err){
        res.status(400).json({message: "Error: "+err.message});
    }
})

module.exports = userRouter;   