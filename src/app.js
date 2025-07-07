
const express = require('express');
const connectDB = require('./config/database');
const port = 3000;

const app = express();
const User = require('./models/user');
app.use(express.json());
//Post request to create a new user. This request requires a JSON payload with the user's name, email, and password. 
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
 
app.get("/user", async (req, res) => {
  const email = req.body.email;
  
      try{
        const users = await User.findOne({email: email }).sort({ _id: -1 });
        if(!users){
          res.status(404).send("User not found");
          
        }
        // if(users.length === 0){
        //   res.status(404).send("User not found");
          
        // }
        res.send(users);
      }  catch(err){
        res.status(500).send("Server Error");
      }
})

//delete request to delete a user. 
app.delete("/user", async (req, res) => {
  const id = req.body._id;
  try{
        const users = await User.findByIdAndDelete(id)
       
        res.send("User has been deleted successfully");
      }  catch(err){
        res.status(500).send("Server Error");
      }
})
//Feed Api - Get All Users
app.get("/feed",  async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send("Server Error");   
  }
})

//Update request to update a user's details. 
app.patch("/user/:id", async (req, res) => {
  const data = req.body;
  const id = req.params?.id;

  try {
    const ALLOWED_UPDATE = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((key) =>
      ALLOWED_UPDATE.includes(key)
    );
    if (!isUpdateAllowed) {
      throw new Error("Invalid update");
    }
    const user = await User.findByIdAndUpdate(id, data, {
      runValidators: true,
    });

    res.send("User has been updated successfully");
  } catch (err) {
    res.status(400).send("Update failed " + err);
  }
});
connectDB().then(()=>{
        console.log("Database is connected");
        
app.listen(port, () => { 
  console.log(`Server is running on http://localhost:${port}`); 
});

         
}).catch(err=>{
  console.error("Error connecting to database");
})
 