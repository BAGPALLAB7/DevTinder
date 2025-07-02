import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Define the schema for the User
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email format");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value, { minLength: 8, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
          throw new Error("Password must be strong");
        }
      },
    },
    age: { type: Number, min: 8 },
    gender: { type: String },
    photoUrl: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photo URL format");
        }
      },
    },
    description: {
      type: String,
      default: "This is a default about of user!",
    },
    skills: {
      type: [String],
      length: 5,
    },
  },
  { timestamps: true }
);


userSchema.methods.getJWT = function () {
const user = this
const token = jwt.sign({ _id: user._id }, "bagpallab7");
return token;
}

userSchema.methods.validatePassword = async function (userPassword) {
const user = this;
return await bcrypt.compare(userPassword, user.password);
}
// Create the User model
const User = mongoose.model("User", userSchema);

export default User; // Default export for ES module
