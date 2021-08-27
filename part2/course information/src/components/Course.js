const Header = ({ course }) => {
  return <h2>{course}</h2>;
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
      {parts.map((part) => (
        <Part key={part.id} part={part} />
      ))}
    </div>
  );
};

const Total = ({ parts }) => {
  let totalEx = parts.reduce((sum, part) => {
    return sum + part.exercises;
  }, 0);

  return <h3>total of {totalEx} exercises</h3>;
};

const Course = ({ course }) => {
  return (
    <div>
      <h1>Web development curriculum</h1>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

export default Course;
