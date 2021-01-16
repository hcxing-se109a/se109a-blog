const app = require("../../server/app.js");
const server = app.listen();
const request = require("supertest").agent(server);
const expect = require("chai").expect;
const testData = require("../data");

let { user, post } = testData;

let auth = {};

describe("API: post", () => {
  before(async () => {});

  after(async () => {
    await testData.deleteTestUser();
    server.close();
  });

  describe("POST api/auth/signup", () => {
    it("sign up with test user", (done) => {
      request
        .post("/api/auth/signup")
        .send({
          email: user.email,
          name: user.name,
          password: user.password,
        })
        .end((err, res) => {
          if (err) return done(err);

          expect(res.status).to.be.equal(201);
          done();
        });
    });
  });

  describe("POST api/auth/login", () => {
    it("login with test user", (done) => {
      request
        .post("/api/auth/login")
        .send({ email: user.email, password: user.password })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          auth.token = res.body.data.token;

          done();
        });
    });
  });

  describe("POST /api/post", () => {
    it("should create a new post", (done) => {
      request
        .post("/api/post")
        .set("Authorization", "Bearer " + auth.token)
        .send({ title: post.title, content: post.content })
        .expect(201)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          post.id = res.body.data.post._id;
          done();
        });
    });
  });

  describe("GET /api/posts", () => {
    it("should return all posts", (done) => {
      request.get("/api/posts").end((err, res) => {
        if (err) return done();

        expect(res.status).to.be.equal(200);
        expect(res.body.data.posts.length).to.not.equal(0);

        return done();
      });
    });
  });

  describe(`GET /api/post/:id`, () => {
    it("should return a post", (done) => {
      request
        .get(`/api/post/${post.id}`)
        .set("Authorization", "Bearer " + auth.token)
        .end((err, res) => {
          if (err) return done();

          expect(res.status).to.be.equal(200);

          done();
        });
    });
  });

  describe("PUT /api/posts/:id", () => {
    it("should update a post", (done) => {
      let newPost = {
        title: "new-test-post",
        content: "123456",
      };
      request
        .put(`/api/post/${post.id}`)
        .set("Authorization", "Bearer " + auth.token)
        .send({ title: newPost.title, content: newPost.content })
        .end((err, res) => {
          if (err) return done();

          expect(res.status).to.be.equal(200);

          done();
        });
    });
  });

  describe("DELETE /api/post/:id", () => {
    it("should delete a post", (done) => {
      request
        .delete(`/api/post/${post.id}`)
        .set("Authorization", "Bearer " + auth.token)
        .end((err, res) => {
          if (err) return done();
          expect(res.status).to.be.equal(200);

          done();
        });
    });
  });
});
