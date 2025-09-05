require('dotenv').config()
const express = require('express');
const connectDB = require('./config/database');
const passport = require('./config/passport');
const session = require('express-session');
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

// Session middleware for passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // set to true in production with HTTPS
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Routes
app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);
app.use("/", chatRouter);

// Error handling middleware for multer
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).send('File too large');
    }
  }
  
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).send('Only image files are allowed!');
  }
  
  res.status(500).send('Something went wrong!');
});

const server = http.createServer(app);
initializeSocket(server)

connectDB().then(()=>{
    console.log("Database is connected");
      
    server.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
 });
           
}).catch(err=>{
  console.error("Error connecting to database");
})