import express from "express";
import User from "../models/user.js";
import userAuth from "../middlewares/auth.js";
import connectionRequestModel from "../models/connectionRequest.js";

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

feedRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let  limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page-1)*limit;
    const logedInUser = req.user;
    const connectionRequest = await connectionRequestModel
      .find({
        $or: [{ fromUserId: logedInUser._id }, { toUserId: logedInUser._id }],
      })
      .select("fromUserId toUserId");

      const hideUser = new Set();
      connectionRequest.map((req) =>{
        hideUser.add(req.fromUserId.toString());
        hideUser.add(req.toUserId.toString());
      })

      const finalFeedUsers = await User.find({
        $and: [{_id: { $nin: Array.from(hideUser)}},{_id: {$ne: logedInUser._id}}]
        
      }).select("firstName lastName about skills age gender photoUrl").skip(skip).limit(limit)

      res.status(200).json({message: "Feed fetched successfull", data: finalFeedUsers})
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default feedRouter;
