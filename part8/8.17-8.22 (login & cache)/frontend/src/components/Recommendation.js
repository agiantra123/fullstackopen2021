import React, { useState, useEffect } from 'react';
import { gql, useQuery, useLazyQuery } from '@apollo/client';

const Recommendations = (props) => {
  const ALL_BOOKS = gql`
    query booksByGenre($allBooksGenres: [String]) {
      allBooks(genres: $allBooksGenres) {
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

  const USER = gql`
    query {
      me {
        favoriteGenre
        name
        username
        id
      }
    }
  `;

  // this is for useQueryLazy
  const [getBooks, result] = useLazyQuery(ALL_BOOKS, {
    fetchPolicy: 'cache-and-network', // trigger multiple times
  });
  // this is for useQueryLazy
  const [books, setBooks] = useState(null);

  /**
   * START: Important! This is the only way I know to fetch authorized data
   */
  const { data, startPolling, stopPolling } = useQuery(USER, {
    skip: !props.show, // this only queries conditionally. If true, does not query
    onCompleted: () => {
      console.log('complete');
      getBooks({ variables: { allBooksGenres: data.me.favoriteGenre } }); // trigger for useQueryLazy
    },
  });
  useEffect(() => {
    startPolling(1000);
    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);
  console.log(data);
  /**
   * END
   */

  // this is for useQueryLazy
  useEffect(() => {
    if (result.data) {
      console.log('setBooks called');
      setBooks(result.data.allBooks);
    }
  }, [result]);

  // trigger for useQueryLazy
  useEffect(() => {
    if (props.show && data) {
      console.log('getBooks called');
      getBooks({ variables: { allBooksGenres: data.me.favoriteGenre } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.show]);

  if (!props.show) {
    return null;
  }

  return (
    <div>
      <h2>books by genre {data && data.me.favoriteGenre}</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books &&
            books.map((a) => (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommendations;
