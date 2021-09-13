import anecdoteService from '../services/anecdotes';

/**
 * * Action Creators
 */

export const voteAnecdote = (anecdote) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.putVote(anecdote);
    dispatch({ type: 'VOTE', data: newAnecdote });
  };
};

export const createAnecdote = (anecdote) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(anecdote);
    dispatch({ type: 'CREATE', data: newAnecdote });
  };
};

export const initAnecdote = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch({
      type: 'INIT', // INIT only for initial value from server
      data: anecdotes,
    });
  };
};

/**
 * * Reducer
 */

// const anecdotesAtStart = [
//   'If it hurts, do it more often',
//   'Adding manpower to a late software project makes it later!',
//   'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
//   'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
//   'Premature optimization is the root of all evil.',
//   'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
// ];

const getId = () => (100000 * Math.random()).toFixed(0);

// const asObject = (anecdote) => {
//   return {
//     content: anecdote,
//     id: getId(),
//     votes: 0,
//   };
// };

// const initialState = anecdotesAtStart.map(asObject);

const reducer = (state = [], action) => {
  // console.log('state now: ', state);
  // console.log('action', action);

  let newState = null;
  switch (action.type) {
    case 'VOTE':
      newState = state.map((anecdote) =>
        anecdote.id !== action.data.id ? anecdote : action.data
      );
      return newState;
    case 'CREATE':
      return [...state, action.data];
    case 'INIT':
      return action.data;
    default:
      return state;
  }

  return state;
};

export default reducer;
