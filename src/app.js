
require("dotenv").config();
const express = require('express');
const connectDB = require('./config/database');
const port = process.env.PORT;
const app = express();
const User = require('./models/user');
const jwt = require('jsonwebtoken');
const {userAuth} = require('./middleware/auth');
const cookieParser = require('cookie-parser');
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require('./routes/user');
const cors = require("cors");
const allowedOrigins = [
  "http://localhost:5173",
  "https://devmatch.vercel.app"
];
app.use(cors({
<<<<<<< HEAD
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
=======
  origin:"http://localhost:5173",
 credentials:true
}))
>>>>>>> 0d77533e73427ce0bae2ef7995b34d9f93090c4e
app.use(express.json());
app.use(cookieParser());
app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter)


                      

//Post request to create a new user. This request requires a JSON payload with the user's name, email, and password. 
   

connectDB().then(()=>{
        console.log("Database is connected");
        
app.listen(port, () => { 
  console.log(`Server is running on http://localhost:${port}`); 
});

         
}).catch(err=>{
  console.error("Error connecting to database");
})
 
