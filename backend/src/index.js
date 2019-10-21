const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

require('dotenv').config({ path: 'variables.env' });
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

// use express middleware to handle cookies (JWT)
server.express.use(cookieParser());

// decode the JWT so we can get the user ID on each request
server.express.use((req, res, next) => {
  const { token } = req.cookies;
  console.log(`token: ${token}`);
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    // put the userId onto the request for further requests to access
    console.log(`userId: ${userId}`);
    req.userId = userId;
  }
  next();
});
// TODO use express middleware to populate current user on each request
server.express.use(async (req, res, next) => {
  // if they are not logged in skip this
  if (!req.userId) return next();
  // if logged in query the user
  const user = await db.query.user(
    { where: { id: req.userId } },
    '{ id, permissions,  email, name}'
  );
  req.user = user;
  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
    },
  },
  deets => {
    console.log(`Server is now running on port http/localhost:${deets.port}`);
  }
);
