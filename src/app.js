import express from "express";
import connectDB from "./config/database.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import profileRouter from "./routes/profile.js";
import requestRouter from "./routes/requests.js";
import userRouter from "./routes/user.js";
import feedRouter from "./routes/feed.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", feedRouter);

app.get("/", (req, res) => {
  res.send("Hello from DevTinder API");
});


connectDB()
  .then(() => {
    console.log("Connected to database");
    app.listen(7777, () => console.log("Server listning to port 7777"));
  })
  .catch((err) => console.log(err));
