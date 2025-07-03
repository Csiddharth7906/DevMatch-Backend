const fs =require("fs")
const express = require('express');
const {adminAuth,userAuth}=require("./middleware/auth")
const app = express();
const port=100;
const data= require("./user.json")

app.use("/admin",adminAuth);
app.get("/user",userAuth,(req, res,next)=>{
  res.send("User data")
})
app.get("/admin/getData",(req,res,next)=>{
  res.send(data) 
  
})
app.get("/admin/DeleteData",(req,res,next)=>{
  res.send("DataGotDeleted")
})

app.listen(port, () => { 
  console.log(`Server is running on http://localhost:${port}`);
});

 