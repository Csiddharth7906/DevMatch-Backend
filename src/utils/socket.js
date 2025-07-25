const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest")


const getSecretRoom =(userId, targetUserId)=>{
  return  crypto.createHash("sha256").update([ userId , targetUserId].sort().join("_")).digest("hex")
}

const initializeSocket=(server)=>{
const io = socket(server,{
      cors:{
        origin: [
        "http://localhost:5173", // for local dev
        "https://dev-match-ui-o51l.vercel.app" // your deployed frontend
      ],
        
      
    }
    })
    
    io.on("connection",(socket)=>{
        socket.on("joinChat",({firstName , userId ,  targetUserId})=>{
            const room =  getSecretRoom(userId,targetUserId)
             console.log(firstName +"Joined Room :"+room)
            socket.join(room);
        });
         socket.on("sendMessage",async ({firstName,lastName,userId,targetUserId,text})=>{
           try{
              const room =getSecretRoom(userId,targetUserId)
              console.log(firstName+" "+text)

             
              //save message to db

               let  chat =await Chat.findOne({
                   participants:{$all: [userId,targetUserId]}
                }) 
                if(!chat){
                  chat = new Chat({
                    participants : [userId, targetUserId],
                    messages: [],
                  })
                }
                chat.messages.push({
                  senderId: userId,
                  text, 
                })
                await chat.save();
                io.to(room).emit("messageReceived",{firstName,lastName,text})
            }catch(err){
               console.log(err)
            }
        });
         socket.on("disconnect",()=>{
          
        });
    })
}
module.exports = initializeSocket;