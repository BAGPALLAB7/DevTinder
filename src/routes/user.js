import express from "express";
import User from "../models/user.js";
import {validateSignUpData} from "../utils/validation.js"
import bcrypt from "bcrypt";

const userRouter = express.Router();
userRouter.post("/findUser", async (req, res) => {
  try {
    const user = await User.find({ email: req.body.email });
    console.log(user);
    if (user.length > 0) {
      res.send(user);
    } else {
      res.status(404).send("No user found");
    }
  } catch (err) {
    res.status(400).send("Not able to find user");
  }
});

userRouter.delete("/deleteUser", async (req, res) => {
  const userID = req.body.userID;
  try {
    await User.findByIdAndDelete(userID);
    res.send("User deleted.");
  } catch (err) {
    res.status(400).send("Something went wrong.");
  }
});

export default userRouter;