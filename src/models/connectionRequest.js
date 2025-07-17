const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
     fromUserId:{
            type: mongoose.Schema.Types.ObjectId,
            required: true
     },
     toUserId:{
            type: mongoose.Schema.Types.ObjectId,
             
            required: true
     },
     status:{
        type: String,
        required: true,
        enum:{
            values:["ignored","interested","accepted","rejected"],
            message: `{VALUE} is incorrect status type`
        }
     }
},
{
    timestamps:true,

}

);
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }); //compound indexd   

connectionRequestSchema.pre("save",function(next){
    const connectionRequest = this;
    //check if the fromUserId is same as toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request to yourself")
    }
    next();
})
const ConnectionRequestModel = new mongoose.model("ConnectionRequest",connectionRequestSchema);

module.exports = ConnectionRequestModel;   