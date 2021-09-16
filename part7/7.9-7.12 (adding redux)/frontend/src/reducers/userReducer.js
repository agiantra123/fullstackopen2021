/* eslint-disable indent */
/**
 * * Action Creators
 */

export const setUser = (user) => {
  return {
    type: 'SET_USER',
    data: user,
  };
};

/**
 * * Reducer
 */

const userReducer = (state = null, action) => {
  console.log('userReducer - state now: ', state);
  console.log('userReducer - action', action);

  switch (action.type) {
    case 'SET_USER':
      return action.data;
    default:
      return state;
  }

  // return state;
};

export default userReducer;
