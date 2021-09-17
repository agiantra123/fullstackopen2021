/* eslint-disable indent */
/**
 * * Action Creators
 */

export const setError = (text) => {
  return {
    type: 'SET_NOTIF_ERROR',
    data: text,
  };
};

export const setSuccess = (text) => {
  return {
    type: 'SET_NOTIF_SUCCESS',
    data: text,
  };
};

/**
 * * Reducer
 */

const notificationReducer = (
  state = { error: null, success: null },
  action
) => {
  // console.log('notificationReducer - state now: ', state);
  // console.log('notificationReducer - action', action);

  switch (action.type) {
    case 'SET_NOTIF_ERROR':
      return { ...state, error: action.data };
    case 'SET_NOTIF_SUCCESS':
      return { ...state, success: action.data };
    default:
      return state;
  }

  // return state;
};

export default notificationReducer;
