import React, { useState } from 'react';
import blogsService from '../services/blogsService';
import PropTypes from 'prop-types';

const Blog = ({ blog, user }) => {
  const [detailVisible, setDetailVisible] = useState(false);

  const isDetailVisible = { display: detailVisible ? '' : 'none' };

  const addLikes = async () => {
    await blogsService.updateBlog(blog.id, {
      ...blog,
      likes: blog.likes + 1,
    }); // this await can be registered to a const, ex: const updatedBlog = ...
  };

  const removeBlog = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`))
      await blogsService.deleteBlog(blog.id);
  };

  const showRemoveButton = {
    display:
      blog.user.username.toString() === user.username.toString() ? '' : 'none',
  };

  return (
    <div
      className='blog'
      style={{
        border: '1px solid rgba(0, 0, 0, 1)',
        marginBottom: '6px',
        padding: '6px',
      }}
    >
      <p style={{ display: 'inline-block' }}>{blog.title}</p>
      <button onClick={() => setDetailVisible(!detailVisible)}>
        {detailVisible ? 'hide' : 'show'}
      </button>
      <div className='details' style={isDetailVisible}>
        <p>
          <a href={blog.url}>{blog.url}</a>
        </p>
        <p style={{ display: 'inline-block' }}>likes {blog.likes}</p>
        <button id='like-button' onClick={addLikes}>
          like
        </button>
        <p>{blog.author}</p>
        <button style={showRemoveButton} onClick={removeBlog}>
          remove
        </button>
      </div>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  // test: PropTypes.string.isRequired,
};

export default Blog;
