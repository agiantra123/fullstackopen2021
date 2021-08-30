// https://intense-refuge-26553.herokuapp.com/api/persons/3

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(express.static('build'));
app.use(express.json());
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(
  morgan(':method :url :status :response-time ms - :res[content-length] :body')
);
app.use(cors());

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

app.get('/info', (request, response) => {
  const date = new Date();
  const message = `<p>Phonebook has info for ${persons.length} people <br><br> ${date}</p>`;
  response.send(message);
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

app.post('/api/persons', (request, response) => {
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
  const id = getRandomInt(1000);
  body.id = id;
  persons = persons.concat(body);
  response.json(body);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
