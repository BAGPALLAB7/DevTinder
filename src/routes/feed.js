import express from "express";
import User from "../models/user.js";

const feedRouter = express.Router();


feedRouter.get("/getAllUser", async (req, res) => {
  try {
    const useraData = await User.find();
    if (useraData.length > 0) {
      res.send(useraData);
    } else {
      res.send("No users");
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

export default feedRouter;