const express = require('express');
const connectDB = require('./config/database');
const validateSignUpData = require("./utils/validation");
const bcrypt = require('bcrypt');
const port = 3000;
const app = express();
const User = require('./models/user');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {userAuth} = require('./middleware/auth');
app.use(express.json());
app.use(cookieParser());

//Post request to create a new user. This request requires a JSON payload with the user's name, email, and password. 
app.post("/signup", async (req, res) => {
  try {
    //validation of data
    validateSignUpData(req);
    const { firstName, lastName, email, password } = req.body;
    //encrypt the passsword
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    // Save the user to the database

    await user.save();
    res.send("User has been created successfully");
  } catch (err) {
    res.status(400).send("ERROR : " + err);
  }
});
 
app.post("/login", async (req, res) => {
  try{
     const {email,password} = req.body;
     const user = await User.findOne({email: email});
  
     if(!user){
       res.status(404).send("invalid credentials");
     }
     const isPasswordValid = await bcrypt.compare(password, user.password);
     if(isPasswordValid){
      
      //Create and sign a JWT token
      const token = await getJwt();
      
      //Add the token to cookie and send the response back to the client
      res.cookie('token', token, {  expires: new Date(Date.now() + 8 * 3600000)} );
    
       res.send("Logged In successfully");
     }else{
      throw new Error("Password is incorrect");
     }
  } catch(err){
    res.status(400).send("Invalid credentials");
  }
})

app.get("/profile",userAuth, async (req, res) => {
    try {
    const user=req.user;
    res.send(user);
    } catch (error) {
       res.status(401).send(error.message);
    }
    
    })  
    
app.post("/sendConnectionRequest",userAuth, async (req, res) => {
     const user = req.user;
     console.log("Sending connection request to: ");
     res.send(user.firstName+" has sent a connection request to you.");
})
connectDB().then(()=>{
        console.log("Database is connected");
        
app.listen(port, () => { 
  console.log(`Server is running on http://localhost:${port}`); 
});

         
}).catch(err=>{
  console.error("Error connecting to database");
})
 