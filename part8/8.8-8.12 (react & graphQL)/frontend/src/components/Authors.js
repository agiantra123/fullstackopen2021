import React, { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';

const Authors = (props) => {
  const ALL_AUTHORS = gql`
    query {
      allAuthors {
        bookCount
        born
        id
        name
      }
    }
  `;

  const UPDATE_AUTHOR = gql`
    mutation updateAuthor(
      $editAuthorName: String!
      $editAuthorSetBornTo: Int!
    ) {
      editAuthor(name: $editAuthorName, setBornTo: $editAuthorSetBornTo) {
        bookCount
        born
        id
        name
      }
    }
  `;

  const authors = useQuery(ALL_AUTHORS);
  const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  const [name, setName] = useState('');
  const [born, setBorn] = useState('');

  const submit = async (event) => {
    event.preventDefault();

    console.log('update author...');
    updateAuthor({
      variables: {
        editAuthorName: name,
        editAuthorSetBornTo: Number(born),
      },
    });

    setName('');
    setBorn('');
  };

  if (!props.show || !authors.data) {
    return null;
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.data.allAuthors &&
            authors.data.allAuthors.map((a) => (
              <tr key={a.name}>
                <td>{a.name}</td>
                <td>{a.born}</td>
                <td>{a.bookCount}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <h2>set birthyear</h2>
      <form onSubmit={submit}>
        {/* <div>
          name
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div> */}
        <select value={name} onChange={({ target }) => setName(target.value)}>
          {authors.data.allAuthors &&
            authors.data.allAuthors.map((a) => (
              <option key={a.id} value={a.name}>
                {a.name}
              </option>
            ))}
        </select>
        <div>
          born
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  );
};

export default Authors;
