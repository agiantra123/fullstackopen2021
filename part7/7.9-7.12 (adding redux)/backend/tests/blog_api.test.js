/**
 * ! IMPORTANT! Test has its own mongodb atlas (blogs-app-test). So, make sure you have sign up a user to its db, not blogs-app
 */

const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

const Blog = require('../models/blog');

/**
 * * Helper (you could write this code below in separate file, tests/test_helper.js)
 */

const initialBlogs = [
  {
    title: 'Latest Updates: At Least 9 Dead as Ida Swamps New York City Area',
    author: 'John Taggart',
    url: 'https://www.nytimes.com/live/2021/09/02/nyregion/nyc-storm',
    likes: 16,
    user: '61343e94a963e0aa305193e4',
  },
  {
    title:
      'Dems block bid to stop Biden’s $3.5T bill from sending taxpayer money to countries with slave labor',
    author: 'Haris Alic',
    url: 'https://www.washingtontimes.com/news/2021/sep/3/dems-block-bid-stop-bidens-35t-bill-sending-taxpay',
    likes: 7,
    user: '61343e94a963e0aa305193e4',
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

let token = null;

/**
 * * Testing starts here
 */

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();

  /**
   * ! username & password must be registered in blogs-app-test
   */

  const user = await api.post('/api/login').send({
    username: 'root',
    password: 'myrootpass',
  });
  console.log(user.body);
  token = user.body.token;
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('verifying the existence of id property', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body[0].id).toBeDefined();
});

describe('addition of a new blog', () => {
  test('a valid blog can be added only with valid token', async () => {
    const newBlog = {
      title:
        "New York City's illegally converted apartments proved deadly in Ida's path",
      author: 'Mark Morales',
      url: 'https://edition.cnn.com/2021/09/03/us/new-york-city-flooding-illegal-basement-apartments/index.html',
      likes: 5,
    };

    await api
      .post('/api/blogs')
      .auth(token, { type: 'bearer' }) // option 1
      // .set('Authorization', 'bearer ' + user.body.token) // option 2
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');

    const titles = response.body.map((r) => r.title);

    expect(response.body).toHaveLength(initialBlogs.length + 1);
    expect(titles).toContain(
      "New York City's illegally converted apartments proved deadly in Ida's path"
    );
  });

  test("a valid blog can't be added without valid token", async () => {
    const newBlog = {
      title:
        "New York City's illegally converted apartments proved deadly in Ida's path",
      author: 'Mark Morales',
      url: 'https://edition.cnn.com/2021/09/03/us/new-york-city-flooding-illegal-basement-apartments/index.html',
      likes: 5,
    };

    await api
      .post('/api/blogs')
      .auth('123', { type: 'bearer' }) // option 1
      // .set('Authorization', 'bearer ' + user.body.token) // option 2
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');

    const titles = response.body.map((r) => r.title);

    expect(response.body).toHaveLength(initialBlogs.length);
    expect(titles).not.toContain(
      "New York City's illegally converted apartments proved deadly in Ida's path"
    );
  });

  test('a valid blog with missing likes property can be added to be zero like only with valid token', async () => {
    const newBlog = {
      title:
        'New Zealand terrorist was released on bail two months before supermarket stabbing',
      author: 'Angus Watson',
      url: 'https://edition.cnn.com/2021/09/04/asia/new-zealand-attacker-intl-hnk/index.html',
    };

    await api
      .post('/api/blogs')
      .auth(token, { type: 'bearer' }) // option 1
      // .set('Authorization', 'bearer ' + user.body.token) // option 2
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');

    const likes = response.body.map((r) => r.likes);

    expect(response.body).toHaveLength(initialBlogs.length + 1);
    expect(likes).toContain(0);
    expect(response.body[initialBlogs.length].likes).toBe(0);
  });

  test('a blog with missing title property return 404 only with valid token', async () => {
    const newBlog = {
      author: 'Angus Watson',
      url: 'https://edition.cnn.com/2021/09/04/asia/new-zealand-attacker-intl-hnk/index.html',
      likes: 90,
    };

    await api
      .post('/api/blogs')
      .auth(token, { type: 'bearer' }) // option 1
      // .set('Authorization', 'bearer ' + user.body.token) // option 2
      .send(newBlog)
      .expect(400);
  });

  test('a blog with missing url property return 404 only with valid token', async () => {
    const newBlog = {
      title:
        "New York City's illegally converted apartments proved deadly in Ida's path",
      author: 'Angus Watson',
      likes: 90,
    };

    await api
      .post('/api/blogs')
      .auth(token, { type: 'bearer' }) // option 1
      // .set('Authorization', 'bearer ' + user.body.token) // option 2
      .send(newBlog)
      .send(newBlog)
      .expect(400);
  });
});

describe('get, put and delete a specific note', () => {
  test('a specific blog can be viewed', async () => {
    const blogsAtStart = await blogsInDb();
    const blogToView = blogsAtStart[0];

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const processedBlogToView = JSON.parse(JSON.stringify(blogToView));
    expect(resultBlog.body).toEqual(processedBlogToView);
  });

  test('a specific blog can be updated', async () => {
    const blogsAtStart = await blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const newBlog = {
      title:
        'Edited: Latest Updates: At Least 9 Dead as Ida Swamps New York City Area',
      author: 'John Taggart',
      url: 'https://www.nytimes.com/live/2021/09/02/nyregion/nyc-storm',
      likes: 10000,
    };

    const updateBlog = await api
      .put(`/api/blogs/${blogToUpdate.id}`, newBlog)
      .auth(token, { type: 'bearer' }) // option 1
      // .set('Authorization', 'bearer ' + user.body.token) // option 2
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const processedBlogToView = JSON.parse(JSON.stringify(blogToUpdate));
    expect(updateBlog.body).toEqual(processedBlogToView);
  });

  test('a specific blog can be deleted only with valid token', async () => {
    const blogsAtStart = await blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .auth(token, { type: 'bearer' }) // option 1
      // .set('Authorization', 'bearer ' + user.body.token) // option 2
      .expect(204);

    const blogsAtEnd = await blogsInDb();
    expect(blogsAtEnd).toHaveLength(initialBlogs.length - 1);

    const contents = blogsAtEnd.map((r) => r.title);
    expect(contents).not.toContain(blogToDelete.title);
  });

  test("a specific blog can't be deleted without valid token", async () => {
    const blogsAtStart = await blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401);

    const blogsAtEnd = await blogsInDb();
    expect(blogsAtEnd).toHaveLength(initialBlogs.length);

    const contents = blogsAtEnd.map((r) => r.title);
    expect(contents).toContain(blogToDelete.title);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
