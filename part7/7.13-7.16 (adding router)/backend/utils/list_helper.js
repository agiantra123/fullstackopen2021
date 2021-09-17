const _ = require('lodash');

const dummy = (blogs) => {
  if (blogs) {
    return 1;
  }
};

const totalLikes = (blogs) => {
  const updatedTotal = blogs.reduce((sum, { likes }) => {
    return sum + likes;
  }, 0);
  return updatedTotal;
};

const favoriteBlog = (blogs) => {
  // https://stackoverflow.com/questions/36941115/return-object-with-highest-value
  const maxBlog = blogs.reduce((max, blog) =>
    blog.likes > max.likes ? blog : max
  );
  delete maxBlog['_id'];
  delete maxBlog['url'];
  delete maxBlog['__v'];
  return maxBlog;
};

const mostBlogs = (blogs) => {
  // https://stackoverflow.com/questions/44649137/lodash-add-keys-to-countby-function
  const authors = _.map(_.countBy(blogs, 'author'), (val, key) => ({
    author: key,
    blogs: val,
  })); // [{author: '', blogs: n},{author: '', blogs: n}]
  const maxAuthor = _.maxBy(authors, 'blogs');
  return maxAuthor;
};

const mostLikes = (blogs) => {
  const authors = _.groupBy(blogs, 'author'); // [{author: [{},{}]},{author: [{},{}]}]
  const likesSum = _.map(authors, (val, key) => ({
    author: key,
    likes: _.sumBy(val, 'likes'),
  })); // [{author: '', likes: n}, {author: '', likes: n}, {author: '', likes: n}]
  const maxAuthor = _.maxBy(likesSum, 'likes');
  return maxAuthor;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
