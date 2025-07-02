const  fs = require('fs');
const express = require('express');
const app = express();
const port=100;
const data=require('./user.json');
app.get('/user', (req, res) => {
  res.send(data); 
});
app.post('/user',(req,res)=>{
  console.log("Data is saved in daatbase");
  res.send('User Created!');
})
app.delete('/user',(req,res)=>{
  
  res.send(`User with ID  deleted`);
});
app.patch('/user',(req,res)=>{
  res.send(`User with ID updated`);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

 