import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Blogs from './components/Blogs';

import { initBlog } from './reducers/blogReducer';
import { setUser } from './reducers/userReducer';
import { setError, setSuccess } from './reducers/notificationReducer';

import loginService from './services/loginService';
import blogService from './services/blogsService';

const App = () => {
  const dispatch = useDispatch();

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [createVisible, setCreateVisible] = useState(false);

  // const [errorMessage, setErrorMessage] = useState(null);
  // const [successMessage, setSuccessMessage] = useState(null);
  const successMessage = useSelector((state) => state.notification.success);
  const errorMessage = useSelector((state) => state.notification.error);

  // const [user, setUser] = useState(null);
  // const [blogs, setBlogs] = useState([]);
  const user = useSelector((state) => state.user);
  const blogs = useSelector((state) => state.blogs);

  useEffect(() => {
    blogService.getAll().then((blogs) => dispatch(initBlog(blogs)));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      // setUser(user);
      dispatch(setUser(user));
      blogService.setToken(user.token);
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
      blogService.setToken(user.token);
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
    const createdBlog = await blogService.createBlog(
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
          <h2>blogs</h2>
          <p>{user.name} logged-in</p>
          <button onClick={handleLogout}>Logout</button>
          <div>
            <div style={hidewhenvisible}>
              <button onClick={() => setCreateVisible(true)}>
                create new blog
              </button>
            </div>
            <div style={showwhenvisible}>
              <BlogForm handleCreate={handleCreate} />
              <button onClick={() => setCreateVisible(false)}>cancel</button>
            </div>
          </div>

          <Blogs blogs={blogs} user={user} />
        </div>
      )}
    </div>
  );
};

export default App;
