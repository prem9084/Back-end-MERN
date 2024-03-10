import fs from "fs";
import jwt from "jsonwebtoken";
import userModel from "../model/userModel.js";
import { compairPassword, hashPassword } from "../utils/authUtiles.js";

export const registerController = async (req, res) => {
  try {
    const { userId, username, bio, password } = req.fields;
    const { photo } = req.files;
    // validations

    if (!userId) {
      res.status(500).send({ message: "User Id is required" });
    }
    if (!username) {
      res.status(500).send({ message: "username is required" });
    }
    if (!bio) {
      res.status(500).send({ message: "Bio is required" });
    }
    if (!password) {
      res.status(500).send({ message: "Password is required" });
    }
    if (photo && photo.size > 1000000) {
      res
        .status(500)
        .send({ message: "Photo's size con not be greter than 1mb" });
    }

    // ckeck user

    const exsitingUser = await userModel.findOne({ userId });
    if (exsitingUser) {
      res.status(500).send({
        success: false,
        message: "User already Register Please Login",
      });
    }
    const hashedPassword = await hashPassword(password);

    const user = await userModel({
      userId,
      username,
      bio,
      password: hashedPassword,
    });

    if (photo) {
      user.photo.data = fs.readFileSync(photo.path);
      user.photo.cantentType = photo.type;
    }
    await user.save();
    res.status(200).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

// for user login

export const userLoginController = async (req, res) => {
  try {
    const { userId, password } = req.body;
    if (!userId || !password) {
      return res.status(500).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    // check user

    const user = await userModel.findOne({ userId });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User is not Registerd Please Register",
      });
    }

    const match = await compairPassword(password, user.password);
    if (!match) {
      return res.status(500).send({
        success: false,
        message: "Invalide Email and Password",
      });
    }

    const token = await jwt.sign({ userId: user.userId }, process.env.JWT, {
      expiresIn: "2d",
    });

    res.status(200).send({
      success: true,
      message: "User Login Successfully",
      user: {
        userId: user.userId,
        username: user.username,
        bio: user.bio,
        photo: user.photo,
      },
      token,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateUserController = async (req, res) => {
  try {
    const { username, bio, userId } = req.fields;
    const { photo } = req.files;
    // validations

    if (!username) {
      res.status(500).send({ message: "username is required" });
    }
    if (!bio) {
      res.status(500).send({ message: "Bio is required" });
    }

    if (photo && photo.size > 1000000) {
      res
        .status(500)
        .send({ message: "Photo's size con not be greter than 1mb" });
    }

    const user = await userModel.findOneAndUpdate(
      { userId: req.params.userId },
      { ...req.fields },
      {
        new: true,
      }
    );

    if (photo) {
      user.photo.data = fs.readFileSync(photo.path);
      user.photo.cantentType = photo.type;
    }
    res.status(200).send({
      success: true,
      message: "User Update Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getPhotoController = async (req, res) => {
  try {
    const user = await userModel
      .findOne({ userId: req.params.userId })
      .select("photo");
    if (user.photo.data) {
      res.set("Cantent-Type", user.photo.cantentType);
      return res.status(200).send(user.photo.data);
    }
  } catch (error) {
    console.log(error);
  }
};

// delete user

export const deleteUserController = async (req, res) => {
  try {
    const user = await userModel.findOneAndDelete({
      userId: req.params.userId,
    });

    res.status(200).send({
      success: true,
      message: "User Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

// get All user

export const getAllUserController = async (req, res) => {
  try {
    const user = await userModel.find({});

    res.status(200).send({
      success: true,
      message: " Get All User  Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

// for user follow

export const FollowUserController = async (req, res) => {
  try {
    const userIdToFollow = req.params.userId;
    const currentUser = req.user;

    const existingUser = await userModel.findOne({ userId: userIdToFollow });

    if (!existingUser) {
      return res.status(400).send({
        message: "User does not found",
      });
    }

    if (!existingUser.followers.includes(currentUser.userId)) {
      await userModel.findOneAndUpdate(
        { userId: userIdToFollow },
        { $push: { followers: currentUser.userId } }
      );

      await userModel.findOneAndUpdate(
        { userId: currentUser.userId },
        { $push: { following: userIdToFollow } }
      );
    } else {
      return res.status(500).send({ message: "You can not follow this user" });
    }

    res.status(200).send({ message: "Successfully followed user" });
  } catch (error) {
    console.log(error);
  }
};

// for user unfollow

export const UnFollowUserController = async (req, res) => {
  try {
    const userIdToUnFollow = req.params.userId;
    const currentUser = req.user;

    const existingUser = await userModel.findOne({ userId: userIdToUnFollow });

    if (!existingUser) {
      res.status(400).send({
        message: "User does not found",
      });
    }

    if (existingUser.followers.includes(currentUser.userId)) {
      await userModel.findOneAndUpdate(
        { userId: userIdToUnFollow },
        {
          $pull: { followers: currentUser.userId },
        }
      );

      await userModel.findOneAndUpdate(
        { userId: currentUser.userId },
        {
          $pull: { following: userIdToUnFollow },
        }
      );
    } else {
      return res.status(500).send({
        message: "You con not unFollow this user",
      });
    }

    res.status(200).send({ message: "Successfully unfollowed user" });
  } catch (error) {
    console.log(error);
  }
};
