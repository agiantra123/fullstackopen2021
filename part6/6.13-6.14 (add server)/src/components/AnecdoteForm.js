import React from 'react';
import { useDispatch } from 'react-redux';
import { createAnecdote } from '../reducers/anecdoteReducer';
import { setNotif, removeNotif } from '../reducers/notificationReducer';
import anecdoteService from '../services/anecdotes';

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const create = async (event) => {
    event.preventDefault();
    const anecdote = event.target.anecdote.value;
    event.target.anecdote.value = '';
    const newAnecdote = await anecdoteService.createNew(anecdote); // first, POST new anecdote to server
    dispatch(createAnecdote(newAnecdote)); // secondly, save returned new anecdote from server to store
    notif(newAnecdote.content); // third, we just need the content field
  };

  const notif = (anecdote) => {
    const message = `you created "${anecdote}"`;
    dispatch(setNotif(message));
    setTimeout(() => {
      dispatch(removeNotif());
    }, 5000);
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={create}>
        <div>
          <input name='anecdote' />
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
