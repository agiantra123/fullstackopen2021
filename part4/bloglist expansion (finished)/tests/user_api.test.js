const mongoose = require('mongoose');
const supertest = require('supertest');
const bcryptjs = require('bcryptjs');

const app = require('../app');

const api = supertest(app);

const User = require('../models/user');

/**
 * * Helper (you could write this code below in separate file, tests/test_helper.js)
 */

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

/**
 * * Testing starts here
 */

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcryptjs.hash('myrootpass', 10);
    const user = new User({ username: 'root', name: 'My Root', passwordHash });

    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: 'dummynewusername',
      name: 'Dummy New Username',
      password: 'dummynewpass',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: 'root',
      name: 'My Root 2',
      password: 'myrootpass2',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('`username` to be unique');

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test('creation fails with proper statuscode and message if username less than 3 char', async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: 'ro',
      name: 'Ro',
      password: 'myropass',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain(
      'is shorter than the minimum allowed length'
    );

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test('creation fails with proper statuscode and message if password less than 3 char', async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: 'dummynewusername',
      name: 'Dummy New Username',
      password: 'du',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('password not valid');

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
