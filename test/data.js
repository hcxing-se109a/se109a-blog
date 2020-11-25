const User = require('../server/models/user')

module.exports = {
  user: {
    email: 'test1@gmail.com',
    name: 'test-user',
    password: '123456'
  },

  deleteTestUser: async () => {
    await User.findOneAndDelete({ email: 'test1@gmail.com' })
  },

  post: {
    title: 'test-post',
    content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  },

  deleteTestPost: async () => {
  }

}