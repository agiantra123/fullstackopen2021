import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

const Persons = ({ _filteredPersons }) => {
  return (
    <div>
      {_filteredPersons.map((_filteredPerson) => {
        return (
          <p key={_filteredPerson.name}>
            {_filteredPerson.name} - {_filteredPerson.number}
          </p>
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

  useEffect(() => {
    axios.get('http://localhost:3001/persons').then((response) => {
      const data = response.data;
      setPersons(data);
    });
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
    if (persons.find((person) => person.name === newName.trim())) {
      alert(`${newName.trim()} is already added to phonebook`);
    } else {
      setPersons(
        persons.concat({ name: newName.trim(), number: newNumber.trim() })
      );
      setNewName('');
      setNewNumber('');
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
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
      <Persons _filteredPersons={filteredPersons()} />
    </div>
  );
};

export default App;
