import express from "express";
import formidable from "express-formidable";
import {
  FollowUserController,
  UnFollowUserController,
  deleteUserController,
  getAllUserController,
  getPhotoController,
  registerController,
  updateUserController,
  userLoginController,
} from "../Controller/userController.js";
import { isAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", formidable(), registerController);
router.post("/login", userLoginController);

// for update

router.put("/update-user/:userId", isAuth, formidable(), updateUserController);

// for get photo

router.get("/get-photo/:userId", isAuth, getPhotoController);

// for delete user

router.delete("/delete-user/:userId", isAuth, deleteUserController);

// for All users

router.get("/all-users", isAuth, getAllUserController);

router.post("/follow/:userId", isAuth, FollowUserController);

router.post("/unfollow/:userId", isAuth, UnFollowUserController);

export default router;
