require('dotenv').config()
const express = require('express');
const connectDB = require('./config/database');
const port = 3000;
const app = express();
const User = require('./models/user');
const jwt = require('jsonwebtoken');
const {userAuth} = require('./middleware/auth');
const cookieParser = require('cookie-parser');
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require('./routes/user');
const chatRouter = require('./routes/chat');

const cors = require("cors");
const http = require("http");
const initializeSocket = require('./utils/socket');

app.use(cors({
  origin: [
    "http://localhost:5173", // for local dev
    "https://dev-match-ui-o51l.vercel.app" // your deployed frontend
  ],  
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);
app.use("/", chatRouter);

const server = http.createServer(app);

  initializeSocket(server)
 

//Post request to create a new user. This request requires a JSON payload with the user's name, email, and password. 
   

connectDB().then(()=>{
        console.log("Database is connected");
        
 server.listen(port, () => { 
  console.log(`Server is running on http://localhost:${port}`); 
});

         
}).catch(err=>{
  console.error("Error connecting to database");
})
 
