import express from "express";
import User from "../models/user.js";
import {validateSignUpData} from "../utils/validation.js"
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
    const { password, firstName, lastName, email, userName } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      userName,
      password: passwordHash,
    });
    await user.save();
    console.log(req.body);

    res.status(201).send("user database updated." + user);
  } catch (err) {
    res.status(400).send("Error updating user database -" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).send("User not found");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).send("Invalid password");
    }
    const token = user.getJWT();
    res.cookie("token", token);
    res.send("Login successful");
  } catch (err) {
    res.status(400).send("Error during login - " + err.message);
  }
});

export default authRouter;
