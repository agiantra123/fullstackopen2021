/**
 * * Action Creators
 */

let timeoutID;
export const setNotif = (message, time) => {
  return async (dispatch) => {
    clearTimeout(timeoutID);
    dispatch({ type: 'SET', message: message });
    timeoutID = setTimeout(() => {
      dispatch(removeNotif());
    }, time);
  };
};

const removeNotif = () => {
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
