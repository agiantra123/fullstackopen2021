import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import _ from 'lodash';

const Books = (props) => {
  const ALL_BOOKS = gql`
    query {
      allBooks {
        genres
        author {
          bookCount
          born
          name
          id
        }
        published
        title
        id
      }
    }
  `;

  const books = useQuery(ALL_BOOKS, {
    skip: !props.show, // this only queries conditionally. If true, does not query
  });

  const [genre, setGenre] = useState(null);

  if (!props.show || !books.data) {
    return null;
  }

  // filtering books from graphql
  const rBooks = () => {
    if (genre === null) return books.data.allBooks;
    return books.data.allBooks.filter((b) => b.genres.includes(genre));
  };

  // map, then union, then sortBy. This is used to map genres into button
  const rGenres = _.sortBy(_.union(..._.map(books.data.allBooks, 'genres')));
  const submitGenre = (g) => {
    setGenre(g);
  };

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {rBooks().map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {
        // showing genres button
        rGenres.map((g, i) => (
          <button onClick={() => submitGenre(g)} key={i}>
            {g}
          </button>
        ))
      }
    </div>
  );
};

export default Books;
