import express from "express";
const profileRouter = express.Router();
import userAuth from "../middlewares/auth.js";
import User from "../models/user.js";


profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const userProfile = req.user;
    res.send(userProfile);
  } catch (error) {
    return res.status(400).send("Error fetching profile - " + error.message);
  }
});

profileRouter.patch("/updateUser/:username", userAuth, async (req, res) => {
  try {
    if (req.user.userName !== req.params.username) {
      throw new Error("Update user not permited.")
    }
    const userName = req.params?.username;
    const { ...updates } = req.body;
    const allowedFields = [
      "firstName",
      "lastName",
      "password",
      "age",
      "gender",
      "photoUrl",
      "description",
      "skills",
    ];
    if (req.body.skills?.length > 5) {
      throw new Error("Too many skills");
    }
    const isAllowed = Object.keys(req.body).every((k) =>
      allowedFields.includes(k)
    );
    if (!isAllowed) {
      throw new Error("Invalid fields in request body");
    }
    const updatedUser = await User.findOneAndUpdate(
      { userName: userName },
      updates,
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).send("User not found");
    }
    res.send("User Updated");
  } catch (err) {
    res.status(400).send("Something went wrong." + err.message);
  }
});

export default profileRouter;