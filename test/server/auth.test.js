const app = require('../../server/app.js')
const server = app.listen()
const request = require('supertest').agent(server)
const expect = require('chai').expect
const User = require('../../server/models/user')
const isAuth = require('../../server/middlewares/is-auth')
const mongoose = require('mongoose')

let user = {
  email: 'test1@gmail.com',
  name: 'test1',
  password: '123456'
}

describe('# Auth API', () => {

  before(async () => {
    mongoose.connect(`${process.env.MONGODB_URI}`, { useNewUrlParser: true, useUnifiedTopology: true })
  })

  after(async () => {
    await User.findOneAndDelete({ email: user.email })
    mongoose.connection.close()
    server.close()
  })

  describe('POST api/auth/signup', () => {
    it('should create user', (done) => {
      request.post('/api/auth/signup')
        .send({
          email: user.email,
          name: user.name,
          password: user.password
        })
        .end((err, res) => {
          if (err) return done(err)

          expect(res.status).to.be.equal(201)
          done()
        })
    })

    it('should throw an error if Email has been use', (done) => {
      request.post('/api/auth/signup')
        .send({
          email: user.email,
          name: user.name,
          password: user.password
        })
        .end((err, res) => {
          if (err) return done(err)

          expect(res.status).to.be.equal(400)
          expect(res.text).to.be.equal('Email has been use!')
          done()
        })
    })
  })

  describe('POST api/auth/login', () => {
    it('should login with the right email and password', (done) => {
      request.post('/api/auth/login')
        .send({ email: user.email, password: user.password })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })
    it('should throw an error when email or password is invalid', (done) => {
      request.post('/api/auth/login')
        .send({ email: user.email, password: 'aaa' })
        .expect(400)
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })
  })

  describe('POST /api/auth/logout', () => {
    it('should logout', (done) => {
      request.post('/api/auth/logout')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })
  })


})