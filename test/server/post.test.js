const app = require('../../server/app.js')
const server = app.listen()
const request = require('supertest').agent(server)
const expect = require('chai').expect
const mongoose = require('mongoose')
const testData = require('../data')

let { user, post } = testData

let auth = {}

describe('API: post', () => {

  before(async () => {
    mongoose.connect(`${process.env.MONGODB_URI}`, { useNewUrlParser: true, useUnifiedTopology: true })
  })

  after(async () => {
    await testData.deleteTestUser()
    mongoose.connection.close()
    server.close()
  })

  describe('POST api/auth/signup', () => {
    it('sign up with test user', (done) => {
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
  })

  describe('POST api/auth/login', () => {
    it('login with test user', (done) => {
      request.post('/api/auth/login')
        .send({ email: user.email, password: user.password })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)

          auth.token = res.body.data.token
          console.log(res.body)
          console.log(auth)
          done()
        })
    })
  })

  describe('POST /api/post', () => {
    it('should create a new post', (done) => {
      request.post('/api/post')
        .set('Authorization', 'Bearer ' + auth.token)
        .send({ title: post.title, content: post.content })
        .expect(201)
        .end((err, res) => {
          if (err) {
            console.log(err)
            return done(err)
          }
          done()
        })
    })
  });

  describe('GET /api/posts', () => {
    it('should return all posts', (done) => {
      request.get('/api/posts')
        .expect(200)
        .end((err, res) => {
          if (err) return done()

          return done()
        })
    });
  });

  describe('GET /api/post/:id', () => {

  });

  describe('PUT /api/posts/:id', () => {

  });

  describe('DELETE /api/post/:id', () => {

  });

})