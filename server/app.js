const Koa = require("koa")
const koaBody = require('koa-body')
const mongoose = require('mongoose')

require('dotenv').config()

const PORT = process.env.PORT || 3000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Se109a-Blog'

const app = new Koa()

app.use(koaBody())

app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*')
  ctx.set('GET, POST, PUT, PATCH, DELETE')
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  await next()
})

const authRoutes = require('./routes/auth')
const postRoutes = require('./routes/post')

app.use(authRoutes.routes())
app.use(postRoutes.routes())

mongoose.connect(`${MONGODB_URI}`, { useNewUrlParser: true, useUnifiedTopology: true })
app.listen(`${PORT}`, () => console.log(`Server: http://localhost:${PORT}`))