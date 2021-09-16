import React from 'react';
import Blog from './Blog';

const Blogs = ({ blogs, user }) => {
  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);

  return (
    <div>
      {sortedBlogs.map((blog) => (
        <Blog key={blog.id} blog={blog} user={user} />
      ))}
    </div>
  );
};

export default Blogs;
