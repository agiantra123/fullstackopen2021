import React, { useState } from 'react';

const BlogForm = ({
  // title,
  // author,
  // url,
  // setTitle,
  // setAuthor,
  // setUrl,
  handleCreate,
}) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={(event) => handleCreate(event, title, author, url)}>
        <div>
          title
          <input
            id='title'
            type='text'
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            id='author'
            type='text'
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url
          <input
            id='url'
            type='text'
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button id='create-button' type='submit'>
          create
        </button>
      </form>
    </div>
  );
};

export default BlogForm;
