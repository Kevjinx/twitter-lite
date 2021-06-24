const jwt = require("jsonwebtoken");
const { jwtConfig } = require("./config");
const { secret, expiresIn  } = jwtConfig;
const bearerToken = require('express-bearer-token')
const db = require('./db/models')
const User = db.User

// Parse out the JWT token from the request header.
// Decode the JWT.
// Find the user based on the JWT payload.


const restoreUser = (req, res, next) => {
  const token = req.token
  if(!token) {
    return res.set("WWW-Authenticate", "Bearer").status(401).end();
    // return next()
  }
  return jwt.verify(
    token,
    secret,
    null,
    async (error, jwtPayload) => {
      if(error) {
        error.status = 401
        return next(error)
      }

      const {id} = jwtPayload.data

      try {
        req.user = await User.findByPk(id);
      } catch (e) {
        return next(e);
      }

      if (!req.user) {
        return res.set("WWW-Authenticate", "Bearer").status(401).end();
      }

      return next()
    }
  )
}

const getUserToken = (user) => {
  // Don't store the user's hashed password
  // in the token data.
  const userDataForToken = {
    id: user.id,
    email: user.email,
  };

  // Create the token.
  const token = jwt.sign(
    { data: userDataForToken },
    secret,
    { expiresIn: parseInt(expiresIn, 10) } // 604,800 seconds = 1 week
  );

  return token;
};

const requireAuth = [ bearerToken(), restoreUser]

module.exports = { getUserToken, requireAuth};
