const blogsRouter = require('express').Router();
const jwt = require('jsonwebtoken');

const Blog = require('../models/blog');
const User = require('../models/user');

const userExtractor = require('../utils/middleware').userExtractor;

/**
 * * Helper
 * * getTokenFrom used when not using middleware
 */

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

/**
 * * Route
 */

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body;

  /**
   * ! Every POST request without valid token can't reach this point/code because token checked wih middleware userExtractor
   */

  if (!body.title) {
    return response.status(400).end();
  } else if (!body.url) {
    return response.status(400).end();
  } else if (!body.likes) {
    body.likes = 0;
  }

  // const token = getTokenFrom(request); // this used when not using middleware
  // const token = request.token; // availabel as we add it using middleware
  // const decodedToken = jwt.verify(token, process.env.SECRET);
  // if (!token || !decodedToken.id) {
  //   return response.status(401).json({ error: 'token missing or invalid' });
  // }
  // const user = await User.findById(decodedToken.id);
  const user = request.user;

  const blog = new Blog({
    author: body.author,
    title: body.title,
    url: body.url,
    likes: body.likes,
    user: user.id, // actually user.id is as same as decodedToken.id
  });

  const savedBlog = await blog.save(); // (1) adding note

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save(); // (2) adding note id in blogs field in user (note id for populate)

  response.status(201).json(savedBlog);
});

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
    id: 1,
  });
  response.json(blogs);
});

blogsRouter.get('/:id', async (request, response) => {
  const id = request.params.id;
  const blog = await Blog.findById(id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.put('/:id', userExtractor, async (request, response) => {
  const id = request.params.id;
  const body = request.body;

  const user = request.user;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id,
  };

  // const updatedBlog = await Blog.findByIdAndUpdate(id, body, { new: true });
  const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true });
  response.status(201).json(updatedBlog);
});

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const id = request.params.id;

  // const token = request.token;
  // const decodedToken = jwt.verify(token, process.env.SECRET);
  // if (!token || !decodedToken.id) {
  //   return response.status(401).json({ error: 'token missing or invalid' });
  // }
  // const user = await User.findById(decodedToken.id);
  const user = request.user;

  const blog = await Blog.findById(id, 'user');
  if (!blog) {
    return response.status(400).json({ error: 'blog id not found' });
  } else if (blog.user.toString() !== user.id.toString()) {
    return response.status(401).json({ error: 'invalid id' });
  }

  await Blog.findByIdAndRemove(id); // (1) deleting note

  const index = user.blogs.indexOf(id);
  if (index >= 0) {
    user.blogs.splice(index, 1);
  }
  await user.save(); // (2) deleting note id from blogs field in user (note id for populate)

  response.status(204).end();
});

module.exports = blogsRouter;
