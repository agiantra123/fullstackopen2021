import React, { useState, useEffect } from 'react';

import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Blogs from './components/Blogs';

import loginService from './services/loginService';
import blogService from './services/blogsService';

const App = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);

  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
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
      setUser(user);
      setUserName('');
      setPassword('');
      console.log(user);
    } catch {
      setErrorMessage('Wrong credentials');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.clear(); // option 1
    // window.localStorage.removeItem('loggedBlogappUser'); // option 2
    setUser(null);
  };

  const handleCreate = async (event) => {
    event.preventDefault();

    const newBlog = {
      title,
      author,
      url,
    };
    const createdBlog = await blogService.createBlog(
      newBlog,
      `bearer ${user.token}`
    ); // option 2: using const token in blogsService, set every login automatically
    setSuccessMessage(
      `a new blog ${createdBlog.title} by ${createdBlog.author} added`
    );
    setTimeout(() => {
      setSuccessMessage(null);
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
          <BlogForm
            title={title}
            author={author}
            url={url}
            setTitle={setTitle}
            setAuthor={setAuthor}
            setUrl={setUrl}
            handleCreate={handleCreate}
            user={user}
            logout={handleLogout}
          />
          <Blogs blogs={blogs} />
        </div>
      )}
    </div>
  );
};

export default App;
