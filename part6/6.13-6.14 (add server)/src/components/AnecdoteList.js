import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { voteAnecdote } from '../reducers/anecdoteReducer';
import { setNotif, removeNotif } from '../reducers/notificationReducer';

const AnecdoteList = () => {
  // these 4 functions works one by one from top to bottom
  const anecdotes = useSelector((state) => state.anecdotes);
  const filter = useSelector((state) => state.filter);
  const sortedAnecdotes = anecdotes.sort((a, b) => b.votes - a.votes);
  const filteredAnecdotes = sortedAnecdotes.filter((anecdote) =>
    anecdote.content.toLowerCase().includes(filter.toLowerCase())
  );
  const dispatch = useDispatch();

  const vote = (id) => {
    console.log('vote', id);
    dispatch(voteAnecdote(id));
    notif(id);
  };

  const notif = (id) => {
    const anecdote = anecdotes.find((anecdote) => anecdote.id === id);
    const message = `you voted "${anecdote.content}"`;
    dispatch(setNotif(message));
    setTimeout(() => {
      dispatch(removeNotif());
    }, 5000);
  };

  return (
    <div>
      {filteredAnecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
