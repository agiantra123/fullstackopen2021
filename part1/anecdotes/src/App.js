import React, { useState } from 'react';

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients',
  ];

  const [votes, setVotes] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [selected, setSelected] = useState(0);

  // for Vote Button
  const addVote = (selected) => () => {
    const lastVotes = [...votes];
    lastVotes[selected] += 1;
    setVotes(lastVotes);
    console.log(lastVotes);
  };

  // for Anecdote Button
  const nextAnecdote = () => {
    setSelected(Math.floor(Math.random() * (7 - 0) + 0));
  };

  // getting anectode with the highest vote
  const higherVote = () => {
    return votes.indexOf(Math.max(...votes));
  };

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      <button onClick={addVote(selected)}>vote</button>
      <button onClick={nextAnecdote}>next anecdote</button>
      {Math.max(...votes) === 0 ? (
        <div>
          <h1>Anecdote with most votes</h1>
          <p>{anecdotes[Math.floor(Math.random() * (7 - 0) + 0)]}</p>
          <p>has 0 votes</p>
        </div>
      ) : (
        <div>
          <h1>Anecdote with most votes</h1>
          <p>{anecdotes[higherVote()]}</p>
          <p>has {votes[higherVote()]} votes</p>
        </div>
      )}
    </div>
  );
};

export default App;
