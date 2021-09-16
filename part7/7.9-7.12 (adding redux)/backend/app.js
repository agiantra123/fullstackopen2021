const config = require('./utils/config');
const express = require('express');
const app = express();
require('express-async-errors');
const cors = require('cors');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const mongoose = require('mongoose');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');

logger.info('connecting to', config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI, (err) => {
    if (err) throw err;
  })
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });

app.use(cors()); // allows requesting from another domain outside the domain
app.use(express.static('build')); // sets base url to show frontend app in build folder (in the root)
app.use(express.json()); // body-parser for using req.body property
app.use(middleware.requestLogger); // logs every request - this used when not using middleware
// app.use(middleware.tokenExtractor); // getting token and send it to request property

/**
 * * There are 3 ways to use middleware: app.use(middleware), app.use('/api/blogs', middleware, blogsRouter), or blogsRouter.post('/', middleware, async (request, response)
 */

// app.use('/api/blogs', middleware.userExtractor, blogsRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

// for end-to-end testing
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/router_for_test');
  app.use('/api/testing', testingRouter);
}

app.use(middleware.unknownEndpoint); // every unknownEndpoint will pass here
app.use(middleware.errorHandler); // handle error when CRUD (look at controllers/blogs.js)

module.exports = app;
