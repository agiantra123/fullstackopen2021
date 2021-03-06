import React from 'react';
import { gql, useQuery } from '@apollo/client';

const Books = (props) => {
  const ALL_BOOKS = gql`
    query {
      allBooks {
        genres
        id
        author
        published
        title
      }
    }
  `;

  const books = useQuery(ALL_BOOKS);

  if (!props.show || !books.data) {
    return null;
  }

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
          {books.data.allBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
