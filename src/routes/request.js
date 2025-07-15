const express =require("express")
const requestRouter = express.Router();
const {userAuth} = require('../middleware/auth');
const ConnectionRequest = require("../models/connectionRequest")

requestRouter.post("/request/send/:status/:toUserId",userAuth, async (req, res) => {
     
  try{
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status =req.params.status;
         const allowedStatus = ["ignored","interested"];
         if(!allowedStatus.includes(status)){
          return res.status(400).json({message:"Invalid status type:"+status})
         }
       const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,  
            status,
       });
       const data = await connectionRequest.save();
       res.json({
          message:"Connection request sent Succesful",
          data
       })

  }catch(err){
     res.status(400).send("ERROR: "+err.message)
  }
     res.send(user.firstName+" has sent a connection request to you.");
})
 
module.exports= requestRouter;  