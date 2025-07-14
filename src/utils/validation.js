const validator = require('validator');

const validateSignUpData = (req)=>{
    const {firstName, lastName, email, password} = req.body;   
    
    if(!firstName  || !lastName){
         throw new Error('First name and last name are required');
    }
    else if(!validator.isEmail(email)){
      throw new Error('Invalid email address');
    }
    else if(!validator.isStrongPassword(password)){
      throw new Error('Password must be at least 8 characters long, contain a combination of uppercase and lowercase letters, numbers, and special characters');
    } 
    
};
const validateProfileEdit = (req)=>{
  const  allowedEditFields = ["firstName","lastName","age","gender","photoUrl","about","skills"];
  const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field));
  return isEditAllowed;

}

module.exports =validateSignUpData;
module.exports = validateProfileEdit;