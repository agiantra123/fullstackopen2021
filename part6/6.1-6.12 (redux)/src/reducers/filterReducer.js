/**
 * * Action Creators
 */

export const addFilter = (text) => {
  return {
    type: 'FILTER',
    text: text,
  };
};

/**
 * * Reducer
 */

const reducer = (state = '', action) => {
  console.log('state now: ', state);
  console.log('action', action);

  switch (action.type) {
    case 'FILTER':
      return action.text;
    default:
      return state;
  }

  return state;
};

export default reducer;
