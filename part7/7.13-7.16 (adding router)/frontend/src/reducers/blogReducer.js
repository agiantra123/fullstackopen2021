/* eslint-disable indent */
/**
 * * Action Creators
 */

export const createBlog = (blog) => {
  return {
    type: 'CREATE_BLOG',
    data: { blog },
  };
};

export const initBlog = (blogs) => {
  return {
    type: 'INIT_BLOG',
    data: blogs,
  };
};

/**
 * * Reducer
 */

const blogReducer = (state = [], action) => {
  // console.log('blogReducer - state now: ', state);
  // console.log('blogReducer - action', action);

  switch (action.type) {
    case 'CREATE_BLOG':
      return [...state, action.data];
    case 'INIT_BLOG':
      return action.data;
    default:
      return state;
  }

  // return state;
};

export default blogReducer;
