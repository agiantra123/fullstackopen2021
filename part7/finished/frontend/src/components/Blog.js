import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import styled from 'styled-components';

import blogsService from '../services/blogsService';
import PropTypes from 'prop-types';

const Button = styled.button`
  background: Bisque;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid Chocolate;
  border-radius: 3px;
`;

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
      <p style={{ display: 'inline-block' }}>
        <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
      </p>
      <Button onClick={() => setDetailVisible(!detailVisible)}>
        {detailVisible ? 'hide' : 'show'}
      </Button>
      <div className='details' style={isDetailVisible}>
        <p>
          <a href={blog.url}>{blog.url}</a>
        </p>
        <p style={{ display: 'inline-block' }}>likes {blog.likes}</p>
        <Button id='like-button' onClick={addLikes}>
          like
        </Button>
        <p>{blog.author}</p>
        <Button style={showRemoveButton} onClick={removeBlog}>
          remove
        </Button>
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
