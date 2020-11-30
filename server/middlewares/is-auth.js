const jwt = require("jsonwebtoken");

module.exports = async (ctx, next) => {
  const authHeader = ctx.header.authorization;
  if (!authHeader) {
    ctx.throw(401, "User not authenticated!");
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "my_token");
  } catch (error) {
    ctx.throw(error.status, error.message);
  }
  if (!decodedToken) {
    ctx.throw(401, "User not authenticated!");
  }
  ctx.state.userId = decodedToken.userId;
  await next();
};
