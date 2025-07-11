import express from "express";
import User from "../models/user.js";
import { validateSignUpData } from "../utils/validation.js";
import bcrypt from "bcrypt";

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  // const userObj = {
  //   firstName: "Pallab new",
  //   lastName: "Bag new",
  //   userName: "pallabbag7",
  //   email: "pallab7.bag@gmail.com",
  //   password: "Pallab@12345",
  //   age: 27,
  //   gender: "male",
  // };
  // const user = new User(userObj);

  try {
    validateSignUpData(req);
    const { password, firstName, lastName, email, userName, gender , age } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      gender,
      userName,
      age,
      password: passwordHash,
    });
    const savedUser = await user.save();
    const token = savedUser.getJWT();
    res.cookie("token", token, { expiresIn: "7d" });
    res.status(201).json({message: "user database updated.", data: savedUser});
  } catch (err) {
    res.status(400).send("Error updating user database -" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("user not found");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).send("Invalid password");
    }
    const token = user.getJWT();
    const userInfo = (({
      _id,
      firstName,
      lastName,
      age,
      skills,
      about,
      photoUrl,
    }) => ({ _id, firstName, lastName, age, skills, about, photoUrl }))(user);
    res.cookie("token", token, { expiresIn: "7d" });
    res.json({ message: "Login successful", data: userInfo });
  } catch (err) {
    res.status(400).send("Error during login - " + err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res
    .cookie("token", null, { expires: new Date(Date.now()) })
    .send("Logout successful.");
});
export default authRouter;
