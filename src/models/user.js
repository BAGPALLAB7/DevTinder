import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Define the schema for the User
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    // userName: { type: String, unique: true, trim: true },
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
        if (
          !validator.isStrongPassword(value, {
            minLength: 8,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          })
        ) {
          throw new Error("Password must be strong");
        }
      },
    },
    age: { type: Number, min: 8 },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message: "Gender type is not supported",
      },
    },
    photoUrl: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photo URL format");
        }
      },
      default: function () {
        if (this.gender === "male") {
          return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCA5xl6NzSgdIa4cqsFYRciby2bJ5JTYTXD7YU1fgBUFDvKYEAWEStcJSWjBaIApD9MjY&usqp=CAU"
        }
        else if (this.gender === "female"){
          return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDsCwBWaJ-476wVgyuebPZ2XG6ahMZoWU3kOdgRexmf3inxVRrvfR8BZC0DJWvLSp0b10&usqp=CAU"
        }
        else {
          return "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
        }
      },
    },
    about: {
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

userSchema.index({ firstName: 1, lastName: 1 });

userSchema.methods.getJWT = function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, "bagpallab7");
  return token;
};

userSchema.methods.validatePassword = async function (userPassword) {
  const user = this;
  return await bcrypt.compare(userPassword, user.password);
};

// Create the User model
const User = mongoose.model("User", userSchema);

export default User; // Default export for ES module
