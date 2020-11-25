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

}