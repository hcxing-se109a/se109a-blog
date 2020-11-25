const Router = require('koa-router')

const authCtrl = require('../controllers/auth')

const router = new Router({
  prefix: '/api/auth'
})

router
  .post('/signup', authCtrl.postSignup)
  .post('/login', authCtrl.postLogin)
  .post('/logout', authCtrl.postLogout)

module.exports = router