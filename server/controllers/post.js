const Post = require('../models/post')
const User = require('../models/user')

class PostController {

  createPost = async (ctx) => {

    const { title, content } = ctx.request.body

    try {
      const post = new Post({
        title: title,
        content: content,
        creator: ctx.state.userId,
        createAt: new Date().toLocaleDateString()
      })
      await post.save()

      const user = await User.findById(ctx.state.userId)

      ctx.status = 201
      ctx.body = {
        message: 'Post created.',
        data: {
          creator: {
            _id: user._id,
            name: user.name
          }
        }
      }

    } catch (error) {
      ctx.throw(error.status, error.message)
    }
  }

}

module.exports = new PostController()