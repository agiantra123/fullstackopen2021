const config = require('./utils/config');
const express = require('express');
const app = express();
const cors = require('cors');
const blogsRouter = require('./controllers/blogs');
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
app.use(middleware.requestLogger); // logs every request

app.use('/api/blogs', blogsRouter);

app.use(middleware.unknownEndpoint); // every unknownEndpoint will pass here
app.use(middleware.errorHandler); // handle error when CRUD (look at controllers/blogs.js)

module.exports = app;
