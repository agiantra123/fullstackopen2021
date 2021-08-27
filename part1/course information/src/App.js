import React from 'react';

const Header = ({ course }) => {
  return <h1>{course}</h1>;
};

const Part = ({ part }) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  );
};

const Content = ({ parts }) => {
  return (
    <div>
      <Part part={parts[0]} />
      <Part part={parts[1]} />
      <Part part={parts[2]} />
    </div>
  );
};

const Total = ({ parts }) => {
  return (
    <p>
      Number of exercises{' '}
      {parts[0].exercises + parts[1].exercises + parts[2].exercises}
    </p>
  );
};

const App = () => {
  // #1 DATA STRUCTURE
  // const course = 'Half Stack application development';
  // const part1 = 'Fundamentals of React';
  // const exercises1 = 10;
  // const part2 = 'Using props to pass data';
  // const exercises2 = 7;
  // const part3 = 'State of a component';
  // const exercises3 = 14;

  // #2 DATA STRUCTURE
  // const course = 'Half Stack application development';
  // const part1 = {
  //   name: 'Fundamentals of React',
  //   exercises: 10,
  // };
  // const part2 = {
  //   name: 'Using props to pass data',
  //   exercises: 7,
  // };
  // const part3 = {
  //   name: 'State of a component',
  //   exercises: 14,
  // };

  // #3 DATA STRUCTURE
  // const course = 'Half Stack application development';
  // const parts = [
  //   {
  //     name: 'Fundamentals of React',
  //     exercises: 10,
  //   },
  //   {
  //     name: 'Using props to pass data',
  //     exercises: 7,
  //   },
  //   {
  //     name: 'State of a component',
  //     exercises: 14,
  //   },
  // ];

  // #4 DATA STRUCTURE
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
      },
      {
        name: 'State of a component',
        exercises: 14,
      },
    ],
  };

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

export default App;
