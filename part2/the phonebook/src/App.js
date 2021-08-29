import React, { useState, useEffect } from 'react';
import notesServices from './services/notes';

const Notification = ({ message, className }) => {
  if (message === null) {
    return null;
  }
  return (
    <div className={`${className}`}>
      <p>{message}</p>
    </div>
  );
};

const Filter = ({ _value, _onChange }) => {
  return (
    <form>
      <div>
        filter shown with: <input value={_value} onChange={_onChange} />
      </div>
    </form>
  );
};

const PersonForm = ({
  _valueName,
  _onChangeName,
  _valueNumber,
  _onChangeNumber,
  _submit,
}) => {
  return (
    <form>
      <div>
        name: <input value={_valueName} onChange={_onChangeName} />
      </div>
      <div>
        number: <input value={_valueNumber} onChange={_onChangeNumber} />
      </div>
      <div>
        <button type='submit' onClick={_submit}>
          add
        </button>
      </div>
    </form>
  );
};

const Persons = ({ _filteredPersons, _onClick }) => {
  return (
    <div>
      {_filteredPersons.map((_filteredPerson) => {
        return (
          <div key={_filteredPerson.number}>
            <p>
              {_filteredPerson.name} - {_filteredPerson.number}
            </p>
            <button
              onClick={() => _onClick(_filteredPerson.id, _filteredPerson.name)}
            >
              Delete
            </button>
          </div>
        );
      })}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newFilter, setNewFilter] = useState('');
  const [errorMessage, setErrorMessage] = useState({
    message: null,
    class: null,
  });

  useEffect(() => {
    notesServices.getAll().then((data) => {
      setPersons(data);
    });

    // without separate module
    // axios.get('http://localhost:3001/persons').then((response) => {
    //   const data = response.data;
    //   setPersons(data);
    // });
  }, []);

  const handleNameChange = (event) => {
    // console.log(event.target.value);
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    // console.log(event.target.value);
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    // console.log(event.target.value);
    setNewFilter(event.target.value);
  };

  const filteredPersons = () => {
    return persons.filter((person) =>
      person.name.toLowerCase().includes(newFilter.toLowerCase())
    );
  };

  const submitNewName = (event) => {
    event.preventDefault();
    const newPerson = { name: newName.trim(), number: newNumber.trim() };
    if (persons.find((person) => person.name === newName.trim())) {
      const person = persons.find((person) => person.name === newName.trim());
      updateName(person.id, newPerson, person.name);
      // alert(`${newName.trim()} is already added to phonebook`);
    } else {
      notesServices.create(newPerson).then((data) => {
        setPersons(persons.concat(data));
        setErrorMessage({ message: `added ${data.name}`, class: 'success' });
        setTimeout(() => setErrorMessage({ message: null, class: null }), 5000);
        setNewName('');
        setNewNumber('');
      });

      // without separate module
      // axios
      //   .post('http://localhost:3001/persons', newPerson)
      //   .then((response) => {
      //     setPersons(persons.concat(response.data));
      //     setNewName('');
      //     setNewNumber('');
      //   });

      // without updating db
      // setPersons(
      //   persons.concat({ name: newName.trim(), number: newNumber.trim() })
      // );
      // setNewName('');
      // setNewNumber('');
    }
  };

  const removeName = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      notesServices.remove(id).then((data) => {
        setPersons(persons.filter((person) => person.id !== id));
      });
    }
  };

  const updateName = (id, newObject, name) => {
    if (
      window.confirm(
        `${name} is already added to phonebook, replace the old number with a new one?`
      )
    ) {
      notesServices
        .update(id, newObject)
        .then((data) => {
          setPersons(
            persons.map((person) => (person.id !== id ? person : data))
          );
          setErrorMessage({
            message: `updated ${data.name}`,
            class: 'success',
          });
          setTimeout(
            () => setErrorMessage({ message: null, class: null }),
            5000
          );
        })
        .catch((error) => {
          setErrorMessage({
            message: `Information of ${newObject.name} has already been removed from server`,
            class: 'error',
          });
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        message={errorMessage.message}
        className={errorMessage.class}
      />
      <Filter _value={newFilter} _onChange={handleFilterChange} />

      <h2>Add a new</h2>
      <PersonForm
        _valueName={newName}
        _onChangeName={handleNameChange}
        _valueNumber={newNumber}
        _onChangeNumber={handleNumberChange}
        _submit={submitNewName}
      />

      <h2>Numbers</h2>
      <Persons _filteredPersons={filteredPersons()} _onClick={removeName} />
    </div>
  );
};

export default App;
