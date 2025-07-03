import express from "express";
const profileRouter = express.Router();
import userAuth from "../middlewares/auth.js";
import User from "../models/user.js";
import { validateStrongPassword } from "../utils/validation.js";
import bcrypt from "bcrypt";


profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const userProfile = req.user;
    res.send(userProfile);
  } catch (error) {
    return res.status(400).send("Error fetching profile - " + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const logedInUser = req.user;
    const allowedFields = [
      "firstName",
      "lastName",
      "password",
      "age",
      "gender",
      "photoUrl",
      "description",
      "skills",
    ];
    if (req.body.skills?.length > 5) {
      throw new Error("Too many skills");
    }
    const isAllowed = Object.keys(req.body).every((k) =>
      allowedFields.includes(k)
    );
    if (!isAllowed) {
      throw new Error("Invalid fields in request body");
    }
    Object.keys(req.body).forEach((key) => 
    logedInUser[key] = req.body[key]);
    await logedInUser.save();
    
    res.json({message: "Profile Updated successfully!", data: logedInUser});
  } catch (err) {
    res.status(400).send("Something went wrong." + err.message);
  }
});

profileRouter.patch("/profile/changePassword", userAuth ,async (req, res)=> {
  try {
    const logedInUser = req.user;
const {password, newPassword} = req.body;
const checkOldPassword = await bcrypt.compare(password, logedInUser.password);
if (!checkOldPassword) {
  throw new Error("Wrong password!");
}
if(!validateStrongPassword(newPassword))
{ throw new Error("Please enter strong password") }

logedInUser.password = await bcrypt.hash(newPassword,10);
await logedInUser.save();
res.send("Password updated successfully");
  } catch (error) {
    res.status(400).send('Error: ' + error.message)
  }


})
export default profileRouter;