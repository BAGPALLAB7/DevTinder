import express from "express";
import userAuth from "../middlewares/auth.js";

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user.firstName + " " + user.lastName + " sent you a connection request.");
  } catch (error) {
    return res.status(400).send("Error sending connection request - " + error.message);
  }
});

export default requestRouter;