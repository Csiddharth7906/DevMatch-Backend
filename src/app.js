const fs =require("fs")
const express = require('express');

const app = express();
const port=100;
const data= require("./user.json")

app.get("/user",(req,res)=>{
  // try{
    throw new Error("APTE ATATET TE TE TE TE TE TE TA")
    res.send("USERDATA")
  // }catch(err){
  //   res.status(500).send("SOMETHINg WRONG")
    
  // }


})
app.use("/",(err,req,res,next)=>{
  if(err){
res.status(500).send("SOMETHINg WRONG")
  }
})


app.listen(port, () => { 
  console.log(`Server is running on http://localhost:${port}`);
});

 