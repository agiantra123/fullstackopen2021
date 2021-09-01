/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-else-return */
/* eslint-disable linebreak-style */
// https://intense-refuge-26553.herokuapp.com/api/persons/3

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();

app.use(express.static('build'));
app.use(express.json());
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(
  morgan(':method :url :status :response-time ms - :res[content-length] :body')
);
app.use(cors());

// let persons = [
//   {
//     id: 1,
//     name: 'Arto Hellas',
//     number: '040-123456',
//   },
//   {
//     id: 2,
//     name: 'Ada Lovelace',
//     number: '39-44-5323523',
//   },
//   {
//     id: 3,
//     name: 'Dan Abramov',
//     number: '12-43-234345',
//   },
//   {
//     id: 4,
//     name: 'Mary Poppendieck',
//     number: '39-23-6423122',
//   },
// ];

// function getRandomInt(max) {
//   return Math.floor(Math.random() * max);
// }

app.get('/info', (request, response) => {
  const date = new Date();
  const message = `<p>Phonebook has info for ${persons.length} people <br><br> ${date}</p>`;
  response.send(message);
});

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    console.log('phonebook:');
    persons.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    response.json(persons);
    // mongoose.connection.close();
  });
});

app.get('/api/persons/:id', (request, response, next) => {
  // const id = Number();
  // const person = persons.find((person) => person.id === id);
  // if (person) {
  //   response.json(person);
  // } else {
  //   response.status(404).end();
  // }
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.delete('/api/persons/:id', (request, response, next) => {
  // const id = Number(request.params.id);
  // persons = persons.filter((person) => person.id !== id);
  // response.status(204).end();
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
});

app.post('/api/persons', (request, response, next) => {
  const body = request.body;
  if (!body.name) {
    return response.status(400).json({
      error: 'name missing',
    });
  } else if (!body.number) {
    return response.status(400).json({
      error: 'number missing',
    });
  } else if (persons.find((person) => person.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique',
    });
  }
  // const id = getRandomInt(1000);
  // body.id = id;
  // persons = persons.concat(body);

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      console.log(
        `added ${savedPerson.name} number ${savedPerson.number} to phonebook`
      );
      response.json(savedPerson);
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
