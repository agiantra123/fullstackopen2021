const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.post('/', async (request, response) => {
  if (!request.body.title) {
    return response.status(400).end();
  } else if (!request.body.url) {
    return response.status(400).end();
  } else if (!request.body.likes) {
    request.body.likes = 0;
  }

  const blog = new Blog(request.body);

  const result = await blog.save();
  response.status(201).json(result);
});

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
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

blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id;
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  // const updatedBlog = await Blog.findByIdAndUpdate(id, body, { new: true });
  const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true });
  response.json(updatedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id;
  await Blog.findByIdAndRemove(id);
  response.status(204).end();
});

module.exports = blogsRouter;
