import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route, useRouteMatch, Link } from 'react-router-dom';
import _ from 'lodash';

import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Blogs from './components/Blogs';

import { initBlog } from './reducers/blogReducer';
import { setUser } from './reducers/userReducer';
import { setError, setSuccess } from './reducers/notificationReducer';

import loginService from './services/loginService';
import blogsService from './services/blogsService';

const App = () => {
  const dispatch = useDispatch();

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [createVisible, setCreateVisible] = useState(false);

  const [comment, setComment] = useState('');

  // const [errorMessage, setErrorMessage] = useState(null);
  // const [successMessage, setSuccessMessage] = useState(null);
  const successMessage = useSelector((state) => state.notification.success);
  const errorMessage = useSelector((state) => state.notification.error);

  // const [user, setUser] = useState(null);
  // const [blogs, setBlogs] = useState([]);
  const user = useSelector((state) => state.user);
  const blogs = useSelector((state) => state.blogs);

  useEffect(() => {
    blogsService.getAll().then((blogs) => dispatch(initBlog(blogs)));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      // setUser(user);
      dispatch(setUser(user));
      blogsService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username: userName,
        password: password,
      });
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogsService.setToken(user.token);
      // setUser(user);
      dispatch(setUser(user));
      setUserName('');
      setPassword('');
      console.log(user);
    } catch (e) {
      dispatch(setError('Wrong credentials'));
      setTimeout(() => {
        dispatch(setError(null));
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.clear(); // option 1
    // window.localStorage.removeItem('loggedBlogappUser'); // option 2
    // setUser(null);
    dispatch(setUser(null));
  };

  const hidewhenvisible = { display: createVisible ? 'none' : '' };
  const showwhenvisible = { display: createVisible ? '' : 'none' };

  const handleCreate = async (event, title, author, url) => {
    event.preventDefault();

    const newBlog = {
      title,
      author,
      url,
    };
    const createdBlog = await blogsService.createBlog(
      newBlog
      // `bearer ${user.token}` // option 1
    ); // option 2: using const token in blogsService, set every login automatically
    // setSuccessMessage(
    //   `a new blog ${createdBlog.title} by ${createdBlog.author} added`
    // );
    dispatch(
      setSuccess(
        `a new blog ${createdBlog.title} by ${createdBlog.author} added`
      )
    );
    setTimeout(() => {
      // setSuccessMessage(null);
      dispatch(setSuccess(null));
    }, 5000);
  };

  const getUsersStats = () => {
    const authors = _.map(_.countBy(blogs, 'user.id'), (val, key) => ({
      user: key,
      blogs: val,
    })); // [{user: '', blogs: n},{user: '', blogs: n}]
    return authors;
  };

  const matchUsers = useRouteMatch('/users/:id');
  const blogsPerUser = matchUsers
    ? blogs.filter((blog) => blog.user.id === matchUsers.params.id)
    : null;

  const matchBlogs = useRouteMatch('/blogs/:id');
  const blogById = matchBlogs
    ? blogs.find((blog) => blog.id === matchBlogs.params.id)
    : null;
  // console.log(blogById);

  const handleSubmitComment = async (event, blog) => {
    event.preventDefault();
    await blogsService.updateBlog(blog.id, {
      ...blog,
      comments: blog.comments.concat(comment),
    }); // this await can be registered to a const, ex: const updatedBlog = ...
  };

  return (
    <div>
      {successMessage !== null && successMessage}
      {errorMessage !== null && errorMessage}
      {user === null ? (
        <LoginForm
          username={userName}
          password={password}
          setUsername={setUserName}
          setPassword={setPassword}
          handleLogin={handleLogin}
        />
      ) : (
        <div>
          <div style={{ backgroundColor: 'grey' }}>
            <Link style={{ margin: 6 }} to='/'>
              home
            </Link>
            <Link style={{ margin: 6 }} to='/users'>
              users
            </Link>
            <Link style={{ margin: 6 }} to='/blogs'>
              blogs
            </Link>
            <p style={{ display: 'inline-block', margin: 6 }}>
              {user.name} logged-in
            </p>
            <button onClick={handleLogout}>Logout</button>
          </div>

          <h2>blog app</h2>

          <Switch>
            <Route path='/users/:id'>
              <h1>
                {blogsPerUser && blogsPerUser.length !== 0
                  ? blogsPerUser[0].user.name
                  : null}
              </h1>
              <h3>added blogs</h3>
              <ul>
                {blogsPerUser &&
                  blogsPerUser.map((blog) => (
                    <li key={blog.id}>{blog.title}</li>
                  ))}
              </ul>
            </Route>
            <Route path='/users'>
              <h1>Users</h1>
              <table>
                <tbody>
                  {getUsersStats().map((stat) => (
                    <tr key={stat.user}>
                      <td>
                        <Link to={`/users/${stat.user}`}>{stat.user}</Link>:{' '}
                      </td>
                      <td>{stat.blogs} blogs</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* {console.log(getUsersStats())} */}
            </Route>
            <Route path='/blogs/:id'>
              {blogById && blogById !== null ? (
                <div>
                  <h1>{blogById.title}</h1>
                  <p>
                    <a href={blogById.url}>{blogById.url}</a>
                  </p>
                  <p>{blogById.likes}</p>
                  <p>added by {blogById.user.name}</p>
                  <h3>comments</h3>
                  <form
                    onSubmit={(event) => handleSubmitComment(event, blogById)}
                  >
                    <input
                      type='text'
                      value={comment}
                      onChange={(event) => setComment(event.target.value)}
                    />
                    <button type='submit'>add comment</button>
                  </form>
                  <ul>
                    {blogById.comments.length !== 0 ? (
                      blogById.comments.map((c) => <li key={c}>{c}</li>)
                    ) : (
                      <p>comments not available</p>
                    )}
                  </ul>
                </div>
              ) : null}
            </Route>
            <Route path='/'>
              <div>
                <div style={hidewhenvisible}>
                  <button onClick={() => setCreateVisible(true)}>
                    create new blog
                  </button>
                </div>
                <div style={showwhenvisible}>
                  <BlogForm handleCreate={handleCreate} />
                  <button onClick={() => setCreateVisible(false)}>
                    cancel
                  </button>
                </div>
              </div>
              <Blogs blogs={blogs} user={user} />
            </Route>
          </Switch>
        </div>
      )}
    </div>
  );
};

export default App;
