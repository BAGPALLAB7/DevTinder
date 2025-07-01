import express from 'express';
import connectDB from './config/database.js';
import User from './models/user.js';
import { validateSignUpData } from './utils/validation.js';
import bcrypt from 'bcrypt';


const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from DevTinder API");
});

app.post("/signup", async (req, res) => {
  
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
    const {password, firstName, lastName, email, userName} = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({firstName, lastName, email, userName, password: passwordHash});
    await user.save();
    console.log(req.body);

    res.status(201).send("user database updated." + user);
  } catch (err) {
    res.status(400).send("Error updating user database -" + err.message);
  }
});

app.post("/findUser", async (req, res) => {
  try {
    const user = await User.find({ email: req.body.email });
    console.log(user);
    if (user.length > 0) {
      res.send(user);
    }else {
      res.status(404).send("No user found");
    }
  } catch (err) {
    res.status(400).send("Not able to find user");
  }
});

app.get("/getAllUser", async (req, res) => {
  try {
    const useraData = await User.find();
    if (useraData.length > 0) {
      res.send(useraData);
    }else {
      res.send("No users");
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.patch("/updateUser/:username", async (req, res) => {
  
  try{
    const userName = req.params?.username;
    const {...updates}= req.body;
    const allowedFields = ["firstName", "lastName", "password", "age", "gender", "photoUrl", "description", "skills"];
    if (req.body.skills?.length > 5) {
      throw new Error("Too many skills");
    }
    const isAllowed = Object.keys(req.body).every(k => (allowedFields.includes(k)));
    if(!isAllowed) {
      throw new Error("Invalid fields in request body");
    }
    const updatedUser = await User.findOneAndUpdate({userName: userName}, updates, {new: true, runValidators: true});
    if(!updatedUser) {
      return res.status(404).send("User not found");
    }
    res.send("User Updated");
  }catch(err){
    res.status(400).send("Something went wrong."+err.message);
  }
});

app.delete("/deleteUser", async (req,res) => {
  const userID = req.body.userID;
  try{
    await User.findByIdAndDelete(userID);
    res.send("User deleted.");
  }catch(err){
    res.status(400).send("Something went wrong.");
  }
})


app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).send("User not found");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send("Invalid password");
    }
    res.send("Login successful");
  } catch (err) {
    res.status(400).send("Error during login - " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Connected to database");
    app.listen(7777, () => console.log("Server listning to port 7777"));
  })
  .catch((err) => console.log(err));
