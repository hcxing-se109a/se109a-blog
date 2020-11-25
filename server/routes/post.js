const Router = require('koa-router')

const postCtrl = require('../controllers/post')
const isAuth = require('../middlewares/is-auth')

const router = new Router({
  prefix: '/api'
})

router
  .get('/posts', postCtrl.getPosts)
  .get('/post/:id', isAuth, postCtrl.getPost)
  .post('/post', isAuth, postCtrl.createPost)
  .put('/post/:id', isAuth, postCtrl.updatePost)
  .delete('/post/:id', isAuth, postCtrl.deletePost)

module.exports = router