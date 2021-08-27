import React, { useState } from 'react';

const Button = ({ clickHandler, text }) => {
  return <button onClick={clickHandler}>{text}</button>;
};

const Statistics = ({ good, neutral, bad }) => {
  let total = good + neutral + bad;
  let average = (good - bad) / total;
  let positive = (good / total) * 100;
  if (good + neutral + bad == 0) {
    return (
      <div>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </div>
    );
  }
  return (
    <div>
      <h1>statistics</h1>
      <tb>
        <StatisticLine text='good' value={good} />
        <StatisticLine text='neutral' value={neutral} />
        <StatisticLine text='bad' value={bad} />
        <StatisticLine text='all' value={total} />
        <StatisticLine text='average' value={average} />
        <StatisticLine text='positive' value={positive + ' %'} />
      </tb>
    </div>
  );
};

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>&nbsp;{value}</td>
    </tr>
  );
};

const App = (props) => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const goodHandler = () => {
    setGood(good + 1);
  };

  const neutralHandler = () => {
    setNeutral(neutral + 1);
  };

  const badHandler = () => {
    setBad(bad + 1);
  };

  return (
    <div>
      <h1>give feedback</h1>
      <Button clickHandler={goodHandler} text='good' />
      <Button clickHandler={neutralHandler} text='neutral' />
      <Button clickHandler={badHandler} text='bad' />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
