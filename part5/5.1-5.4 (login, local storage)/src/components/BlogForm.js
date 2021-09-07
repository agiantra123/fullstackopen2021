import React from 'react';

const BlogForm = ({
  title,
  author,
  url,
  setTitle,
  setAuthor,
  setUrl,
  handleCreate,
  user,
  logout,
}) => {
  return (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged-in</p>
      <button onClick={logout}>Logout</button>
      <h2>create new</h2>
      <form onSubmit={handleCreate}>
        <div>
          title
          <input
            type='text'
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            type='text'
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url
          <input
            type='text'
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  );
};

export default BlogForm;
