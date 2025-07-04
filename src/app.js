
const express = require('express');
const connectDB = require('./config/database');
const port = 3000;

const app = express();

connectDB().then(()=>{
        console.log("Database is connected");
        
app.listen(port, () => { 
  console.log(`Server is running on http://localhost:${port}`);
});

         
}).catch(err=>{
  console.error("Error connecting to database");
})
 