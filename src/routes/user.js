import express from "express";
import User from "../models/user.js";
import userAuth from "../middlewares/auth.js";
import connectionRequestModel from "../models/connectionRequest.js";

const userRouter = express.Router();
userRouter.post("/findUser", async (req, res) => {
  try {
    const user = await User.findById(req.body.id);
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

userRouter.get("/user/requests/pending", userAuth, async (req, res) => {
  try {
    const logedInUser = req.user;
    const pendingRequests = await connectionRequestModel
      .find({
        toUserId: logedInUser._id,
        status: "interested",
      })
      .populate("fromUserId", "firstName lastName age gender skills about photoUrl");
    if (pendingRequests.length <= 0) {
      return res.status(404).json({ message: "No pending requests." });
    }
    res.status(200).send(pendingRequests);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

userRouter.get
  ("/user/connections",
  userAuth,
  async (req, res) => {
    try {
      const logedInUser = req.user;
      const allrequests = await connectionRequestModel.find({
        $or: [{ fromUserId: logedInUser._id, status: "accepted" }, { toUserId: logedInUser._id, status: "accepted" }]
      }).populate("fromUserId", "firstName lastName age skills about photoUrl").populate("toUserId", "firstName lastName age skills about photoUrl");
      if (allrequests.length <= 0) {
        return res.status(404).json({ message: "No connections." });
      }
      const data = allrequests.map((row) => {
        if (row.fromUserId._id.equals(logedInUser._id )) {
          return row.toUserId
        } else {
          return row.fromUserId
        }
      })

      res.status(200).json({data: data});
    } catch (error) {
      res.status(400).send(error.message);
    }
  });

export default userRouter;
