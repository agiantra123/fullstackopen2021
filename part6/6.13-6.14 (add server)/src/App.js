import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import anecdoteService from './services/anecdotes';
import { initAnecdote } from './reducers/anecdoteReducer';

import Filter from './components/Filter';
import Notification from './components/Notification';
import AnecdoteList from './components/AnecdoteList';
import AnecdoteForm from './components/AnecdoteForm';

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    anecdoteService.getAll().then((anecdotes) => {
      // first: get all obects in an array from server
      dispatch(initAnecdote(anecdotes)); // secondly, save all objects to the store using UNIT
    });
  }, [dispatch]);

  return (
    <div>
      <h2>Anecdotes</h2>
      <Filter />
      <Notification />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  );
};

export default App;
