/**
 * * Action Creators
 */

export const setNotif = (message) => {
  return {
    type: 'SET',
    message: message,
  };
};

export const removeNotif = () => {
  return {
    type: 'REMOVE',
    message: null,
  };
};

/**
 * * Reducer
 */

const reducer = (state = null, action) => {
  // console.log('state now: ', state);
  // console.log('action', action);

  switch (action.type) {
    case 'SET':
      return action.message;
    case 'REMOVE':
      return action.message;
    default:
      return state;
  }

  return state;
};

export default reducer;
