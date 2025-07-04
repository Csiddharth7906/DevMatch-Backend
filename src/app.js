
const express = require('express');
const connectDB = require('./config/database');
const port = 3000;

const app = express();
const User = require('./models/user');
app.use(express.json());
app.post('/signup', async (req, res) => {
           
  const user = new User(req.body);
  // Save the user to the database
  try{
    await user.save();
    res.send("User has been created successfully");
  }catch(err){
    res.status(400).send(err);
  }
 
})

connectDB().then(()=>{
        console.log("Database is connected");
        
app.listen(port, () => { 
  console.log(`Server is running on http://localhost:${port}`);
});

         
}).catch(err=>{
  console.error("Error connecting to database");
})
 