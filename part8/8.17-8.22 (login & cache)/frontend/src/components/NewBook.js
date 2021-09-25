import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

const NewBook = (props) => {
  const CREATE_BOOK = gql`
    mutation createBook(
      $addBookTitle: String!
      $addBookAuthor: String!
      $addBookPublished: Int!
      $addBookGenres: [String!]!
    ) {
      addBook(
        title: $addBookTitle
        author: $addBookAuthor
        published: $addBookPublished
        genres: $addBookGenres
      ) {
        genres
        published
        author {
          bookCount
          born
          name
          id
        }
        title
        id
      }
    }
  `;

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

  const [title, setTitle] = useState('');
  const [author, setAuhtor] = useState('');
  const [published, setPublished] = useState('');
  const [genre, setGenre] = useState('');
  const [genres, setGenres] = useState([]);

  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: ALL_AUTHORS }, { query: ALL_BOOKS }], // remember! there're 3 options to update the data
    onError: (error) => {
      console.log(error);
      console.log(error.graphQLErrors[0].message);
    },
  });

  if (!props.show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();

    console.log('add book...', title, author, Number(published), genres);
    createBook({
      variables: {
        addBookTitle: title,
        addBookAuthor: author,
        addBookPublished: Number(published),
        addBookGenres: genres,
      },
    });

    setTitle('');
    setPublished('');
    setAuhtor('');
    setGenres([]);
    setGenre('');
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre('');
  };

  return (
    <div>
      <h2>new books</h2>

      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuhtor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type='number'
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type='button'>
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type='submit'>create book</button>
      </form>
    </div>
  );
};

export default NewBook;
