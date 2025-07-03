const adminAuth =(req,res,next)=>{
  const token = true;
  const isAutorized = token === false;
  if(!isAutorized){
    res.status(401).send("Unauthorized access")
  }else{
    next()
  }
};
const userAuth =(req,res,next)=>{
  const token = true;
  const isAutorized = token === false;
  if(!isAutorized){
    res.status(401).send("Unauthorized access")
  }else{
    next()
  }
};

module.exports ={adminAuth,userAuth}