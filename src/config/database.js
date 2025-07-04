const mongoose = require("mongoose");


const connectDB = async ()=>{

  await   mongoose.connect(
        "mongodb+srv://siddharthchauhan_0:Siddharth0@cluster0.y4bqnrh.mongodb.net/devMatch"
    )
}
module.exports = connectDB;
  
