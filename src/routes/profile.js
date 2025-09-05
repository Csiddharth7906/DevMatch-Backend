const express = require("express");
const profileRouter = express.Router();
const { validateProfileEdit } = require("../utils/validation");
const { userAuth } = require("../middleware/auth");
const { uploadToCloudinary } = require("../utils/cloudinary");
const upload = require("../middleware/upload");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(401).send(error.message);
  }
});

profileRouter.patch(
  "/profile/edit",
  userAuth,
  upload.single("photo"), // <-- expects `photo` field from frontend
  async (req, res) => {
    try {
      console.log('Request body:', req.body);
      console.log('Request file:', req.file);
      
      const loggedInUser = req.user;

      // ✅ Handle photo upload if file is provided
      if (req.file) {
        console.log('Uploading file to Cloudinary...');
        const result = await uploadToCloudinary(req.file.buffer, "profile_pics");
        loggedInUser.photoUrl = result.secure_url; // update user profile photo
        console.log('File uploaded successfully:', result.secure_url);
      }

      // ✅ Handle skills parsing (since it comes as JSON string from FormData)
      if (req.body.skills) {
        try {
          req.body.skills = JSON.parse(req.body.skills);
          console.log('Parsed skills:', req.body.skills);
        } catch (parseError) {
          console.error('Error parsing skills:', parseError);
          return res.status(400).send("Error: Invalid skills format");
        }
      }

      // ✅ Handle other fields (name, bio, etc.)
      Object.keys(req.body).forEach((key) => {
        if (key !== 'photo') { // Skip the file field
          console.log(`Updating ${key}:`, req.body[key]);
          loggedInUser[key] = req.body[key];
        }
      });
   
      await loggedInUser.save();
      console.log('User saved successfully');

      res.send({
        message: `${loggedInUser.firstName} updated profile successfully`,
        user: loggedInUser, // ✅ Changed from 'data' to 'user' to match frontend expectation
      });
    } catch (err) {
      console.error('Full error:', err);
      res.status(400).send("Error: " + err.message);
    }
  }
);

module.exports = profileRouter;