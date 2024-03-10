import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      unique: true,
    },
    username: {
      type: String,
      required: [true, "User Name is required"],
    },
    bio: {
      type: String,
      required: [true, "Bio is required"],
    },
    password: {
      type: String,
      required: [true, "Name is required"],
    },
    photo: {
      data: Buffer,
      cantentType: String,
    },
    followers: [{ type: String, ref: "User" }],
    following: [{ type: String, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
