const express = require("express");
const { userAuth } = require("../middleware/auth");
const userRouter = express.Router();
const User = require("../models/user");
const connectionRequest = require("../models/connectionRequest")
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills github linkedin portfolio instagram twitter youtube website";
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

// Get detailed profile of a specific user with GitHub repositories
userRouter.get("/user/profile/:userId", userAuth, async (req, res) => {
    try {
        const { userId } = req.params;
        const loggedInUser = req.user;
        
        // Find the target user
        const targetUser = await User.findById(userId).select(
            "firstName lastName photoUrl age gender about skills github linkedin portfolio location experience githubRepos lastGithubSync isProfilePublic createdAt"
        );
        
        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Check if profile is public or if users are connected
        if (!targetUser.isProfilePublic) {
            const connection = await connectionRequest.findOne({
                $or: [
                    { fromUserId: loggedInUser._id, toUserId: userId, status: "accepted" },
                    { fromUserId: userId, toUserId: loggedInUser._id, status: "accepted" }
                ]
            });
            
            if (!connection) {
                return res.status(403).json({ 
                    message: "This profile is private. Connect with the user to view their full profile.",
                    basicInfo: {
                        firstName: targetUser.firstName,
                        lastName: targetUser.lastName,
                        photoUrl: targetUser.photoUrl,
                        skills: targetUser.skills
                    }
                });
            }
        }
        
        // Check connection status between users
        const connectionStatus = await connectionRequest.findOne({
            $or: [
                { fromUserId: loggedInUser._id, toUserId: userId },
                { fromUserId: userId, toUserId: loggedInUser._id }
            ]
        });
        
        let userConnectionStatus = "none";
        if (connectionStatus) {
            if (connectionStatus.fromUserId.toString() === loggedInUser._id.toString()) {
                userConnectionStatus = connectionStatus.status === "accepted" ? "connected" : "sent";
            } else {
                userConnectionStatus = connectionStatus.status === "accepted" ? "connected" : "received";
            }
        }
        
        // Prepare response data
        const profileData = {
            _id: targetUser._id,
            firstName: targetUser.firstName,
            lastName: targetUser.lastName,
            photoUrl: targetUser.photoUrl,
            age: targetUser.age,
            gender: targetUser.gender,
            about: targetUser.about,
            skills: targetUser.skills,
            github: targetUser.github,
            linkedin: targetUser.linkedin,
            portfolio: targetUser.portfolio,
            instagram: targetUser.instagram,
            twitter: targetUser.twitter,
            youtube: targetUser.youtube,
            website: targetUser.website,
            location: targetUser.location,
            experience: targetUser.experience,
            githubRepos: targetUser.githubRepos || [],
            memberSince: targetUser.createdAt,
            connectionStatus: userConnectionStatus,
            lastGithubSync: targetUser.lastGithubSync
        };
        
        res.json({
            message: "Profile fetched successfully",
            data: profileData
        });
        
    } catch (err) {
        res.status(400).json({ message: "Error: " + err.message });
    }
})

// Sync GitHub repositories for a user
userRouter.post("/user/sync-github", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const githubService = require('../utils/github');
        
        if (!loggedInUser.github) {
            return res.status(400).json({ 
                message: "GitHub URL not found in profile. Please add your GitHub URL first." 
            });
        }
        
        // Check if sync is needed (avoid too frequent syncs)
        if (loggedInUser.lastGithubSync && !githubService.needsRefresh(loggedInUser.lastGithubSync)) {
            return res.json({
                message: "GitHub data is already up to date",
                data: loggedInUser.githubRepos,
                lastSync: loggedInUser.lastGithubSync
            });
        }
        
        const repos = await githubService.syncUserRepositories(loggedInUser);
        
        res.json({
            message: "GitHub repositories synced successfully",
            data: repos,
            lastSync: loggedInUser.lastGithubSync
        });
        
    } catch (err) {
        res.status(400).json({ 
            message: "GitHub sync failed: " + err.message 
        });
    }
})

module.exports = userRouter;