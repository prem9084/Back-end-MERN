import express from "express";
import {
  createPostController,
  deletePostController,
  getAllPostController,
  updatePostController,
} from "../Controller/PostController.js";
import { isAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// create post

router.post("/create-post", isAuth, createPostController);
router.put("/update-post/:postId", isAuth, updatePostController);
router.delete("/delete-post/:postId", isAuth, deletePostController);
router.get("/get-post", isAuth, getAllPostController);

export default router;
