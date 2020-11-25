const Router = require('koa-router')

const postCtrl = require('../controllers/post')
const isAuth = require('../middlewares/is-auth')

const router = new Router({
  prefix: '/api'
})

router
  // .get('/posts', isAuth, postCtrl.getPosts)
  // .get('/post/:id', isAuth, postCtrl.getPost)
  .post('/post', isAuth, postCtrl.createPost)

module.exports = router