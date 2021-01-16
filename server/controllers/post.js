const Post = require("../models/post");
const User = require("../models/user");

class PostController {
  getPosts = async (ctx) => {
    const currentPage = ctx.query.page || 1;
    const perPage = 5;
    try {
      const totalItems = await Post.find().countDocuments();

      let posts = await Post.find()
        .populate("creator", "name")
        .sort("-createAt")
        .skip((currentPage - 1) * perPage)
        .limit(perPage);

      ctx.status = 200;
      ctx.body = {
        message: "Posts fetched.",
        data: {
          posts: posts,
          totalItems: totalItems,
        },
      };
    } catch (error) {
      ctx.throw(error.statusCode, error.message);
    }
  };

  getPost = async (ctx) => {
    const postId = ctx.params.id;
    const post = await Post.findById(postId);
    try {
      if (!post) {
        ctx.throw(404, "Could not found post!");
      }
      ctx.status = 200;
      ctx.body = {
        message: "Post fetched",
        data: {
          post: post,
        },
      };
    } catch (error) {
      ctx.throw(error.statusCode, error.message);
    }
  };

  createPost = async (ctx) => {
    const { title, content } = ctx.request.body;

    try {
      const post = new Post({
        title: title,
        content: content,
        creator: ctx.state.userId,
        createAt: new Date(),
      });
      await post.save();

      const user = await User.findById(ctx.state.userId);

      ctx.status = 201;
      ctx.body = {
        message: "Post created.",
        data: {
          post,
        },
      };
    } catch (error) {
      ctx.throw(error.status, error.message);
    }
  };

  updatePost = async (ctx) => {
    const postId = ctx.params.id;
    const { title, content } = ctx.request.body;

    try {
      const post = await Post.findById(postId);
      if (!post) {
        ctx.throw(404, "Post not found!");
      }
      if (post.creator.toString() !== ctx.state.userId) {
        ctx.throw(403, "Not Authorized");
      }

      let result = await Post.findOneAndUpdate(
        {
          _id: postId,
        },
        { title: title, content: content }
      );

      ctx.status = 200;
      ctx.body = {
        coed: 200,
        message: "Post updated.",
        data: {
          result,
        },
      };
    } catch (error) {
      ctx.throw(error.status, error.message);
    }
  };

  deletePost = async (ctx) => {
    const postId = ctx.params.id;
    try {
      const post = await Post.findById(postId);
      if (!post) {
        ctx.throw(404, "Post not found!");
      }
      if (post.creator.toString() !== ctx.state.userId) {
        ctx.throw(403, "Not Authorized!");
      }
      await Post.findByIdAndRemove(postId);

      ctx.status = 200;
      ctx.body = {
        code: 200,
        message: "Post deleted.",
      };
    } catch (error) {
      ctx.throw(error.status, error.message);
    }
  };
}

module.exports = new PostController();
