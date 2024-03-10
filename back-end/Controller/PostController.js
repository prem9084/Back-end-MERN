import PostModel from "../model/PostModel.js";

export const createPostController = async (req, res) => {
  try {
    const { postId, title, content } = req.body;

    // validations
    if (!postId) {
      return res.status(500).send({ message: "Post ID required" });
    }
    if (!title) {
      return res.status(500).send({ message: "Title is required" });
    }
    if (!content) {
      return res.status(500).send({ message: "Content is required" });
    }

    const uniqueId = await PostModel.findOne({ postId });

    if (uniqueId) {
      return res.status(500).send({ message: "Post Id is unique" });
    }

    const post = await PostModel.create({
      postId,
      title,
      content,
    });

    res.status(200).send({
      success: true,
      message: "Post Created successfully",
      post,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updatePostController = async (req, res) => {
  try {
    const { postId, title, content } = req.body;

    // validations
    if (!postId) {
      return res.status(500).send({ message: "Post ID required" });
    }
    if (!title) {
      return res.status(500).send({ message: "Title is required" });
    }
    if (!content) {
      return res.status(500).send({ message: "Content is required" });
    }

    const post = await PostModel.findOneAndUpdate(
      req.body.userId,
      {
        ...req.body,
      },
      { new: true }
    );

    await post.save();

    res.status(200).send({
      success: true,
      message: "Post Updated successfully",
      post,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deletePostController = async (req, res) => {
  try {
    const postId = req.params.postId;

    const findPost = await PostModel.findOne({ postId });

    if (!findPost) {
      return res.status(500).send({
        message: "Post not found",
      });
    }

    const post = await PostModel.findOneAndDelete(req.params.postId);

    res.status(200).send({
      success: true,
      message: "Post Deleted successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllPostController = async (req, res) => {
  try {
    const post = await PostModel.find({});

    res.status(200).send({
      totaleCount: post.length,
      success: true,
      message: "All Post get successfully",
      post,
    });
  } catch (error) {
    console.log(error);
  }
};
