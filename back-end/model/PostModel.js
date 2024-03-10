import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    postId: {
      type: String,
      required: true,
      unique: [true, "Post id is unique"],
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Post", PostSchema);
