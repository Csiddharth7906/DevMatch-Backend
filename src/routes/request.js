const express =require("express")
const requestRouter = express.Router();
const {userAuth} = require('../middleware/auth');

requestRouter.post("/sendConnectionRequest",userAuth, async (req, res) => {
     const user = req.user;
     console.log("Sending connection request to: ");
     res.send(user.firstName+" has sent a connection request to you.");
})
 
module.exports= requestRouter;  