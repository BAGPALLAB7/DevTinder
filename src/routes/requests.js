import express from "express";
import userAuth from "../middlewares/auth.js";
import connectionRequestModel from "../models/connectionRequest.js";
import User from "../models/user.js";

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(
      user.firstName + " " + user.lastName + " sent you a connection request."
    );
  } catch (error) {
    return res
      .status(400)
      .send("Error sending connection request - " + error.message);
  }
});

requestRouter.post(
  "/request/sned/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const allowedStatus = ["ignored", "interested"];
      const checkToUser = await User.findById(toUserId);
      if (!checkToUser) {
        throw new Error("You are tying to send request to a ghost user!");
      }
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "invalid status type: " + status });
      }
      const checkExistingConnectionRequest =
        await connectionRequestModel.findOne({
          $or: [
            { fromUserId, toUserId },
            { fromUserId: toUserId, toUserId: fromUserId },
          ],
        });
      if (checkExistingConnectionRequest) {
        throw new Error("Connection request already exists");
      }
      const connectionRequest = new connectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message:
          req.user.firstName + " is " + status + " in " + checkToUser.firstName,
        data,
      });
    } catch (error) {
      res.status(400).send("error : " + error);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    const logedInUser = req.user;
    const { status, requestId } = req.params;
    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: status + " is not allowed." });
    }
    const findRequest = await connectionRequestModel.findOne({
      _id: requestId,
      toUserId: logedInUser._id,
      status: "interested",
    });
    if (!findRequest) {
      return res.status(404).json({ message: "connection request not found." });
    }
    findRequest.status = status;
    await findRequest.save();
    res.json({ message: "Review connection request successfull." });
  }
);

export default requestRouter;
