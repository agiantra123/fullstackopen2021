import React from 'react';
import { connect } from 'react-redux';

import { voteAnecdote } from '../reducers/anecdoteReducer';
import { setNotif } from '../reducers/notificationReducer';

const AnecdoteList = (props) => {
  // these 4 functions works one by one from top to bottom
  const anecdotes = props.anecdotes;
  const filter = props.filter;
  const sortedAnecdotes = anecdotes.sort((a, b) => b.votes - a.votes);
  const filteredAnecdotes = sortedAnecdotes.filter((anecdote) =>
    anecdote.content.toLowerCase().includes(filter.toLowerCase())
  );

  const vote = (id) => {
    const anecdote = anecdotes.find((anecdote) => anecdote.id === id);
    props.voteAnecdote({ ...anecdote, votes: anecdote.votes + 1 });
    props.setNotif(`you voted "${anecdote.content}"`, 5000);
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

const mapStateToProps = (state) => {
  return {
    anecdotes: state.anecdotes,
    filter: state.filter,
  };
};

const mapDispatchToProps = {
  voteAnecdote,
  setNotif,
};

const ConnectedAnecdoteList = connect(
  mapStateToProps,
  mapDispatchToProps
)(AnecdoteList);
export default ConnectedAnecdoteList;
