const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// const { signup } = require('../utils/validation')

class authController {
  postSignup = async (ctx) => {
    let { email, name, password } = ctx.request.body;
    try {
      let hasUser = await User.findOne({ email, email });
      if (hasUser) {
        ctx.throw(400, "Email has been use!");
      }
      let newUser = await new User({
        email: email,
        name: name,
        password: bcrypt.hashSync(password, 12),
      }).save();

      ctx.status = 201;
      ctx.body = {
        message: "Sign up successfully",
      };
    } catch (error) {
      ctx.throw(error.statusCode, error.message);
    }
  };

  postLogin = async (ctx) => {
    const { email, password } = ctx.request.body;
    try {
      const hasUser = await User.findOne({ email: email });

      if (hasUser && bcrypt.compareSync(password, hasUser.password)) {
        // JWT Token Authentication
        const token = jwt.sign(
          {
            email: hasUser.email,
            userId: hasUser._id.toString(),
          },
          "my_token",
          { expiresIn: "1h" }
        );

        ctx.status = 200;
        ctx.body = {
          message: "Login success.",
          data: {
            token: token.toString(),
            userId: hasUser._id,
            name: hasUser.name,
          },
        };
      } else {
        ctx.throw(400, "Invalid email or password.");
      }
    } catch (error) {
      ctx.throw(error.statusCode, error.message);
    }
  };

  postLogout = (ctx) => {
    ctx.body = {
      message: "Logout success.",
    };
  };
}

module.exports = new authController();
