import React, { useState, useEffect } from 'react';
import { useApolloClient } from '@apollo/client';

import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import LoginForm from './components/LoginForm';
import Recommendations from './components/Recommendation';

const App = () => {
  const [page, setPage] = useState('authors');
  const [token, setToken] = useState(null); // setToken indicates that user has signed in

  const client = useApolloClient(); // for removing/resetting the cache of the Apollo client

  const logout = () => {
    // when signing out, remove 3 things: local storage items, related states, & cache of the Apollo client
    setToken(null);
    localStorage.clear();
    client.resetStore();
    setPage('authors');
  };

  useEffect(() => {
    // when start, do 2 things: getting local storage items and setting related states
    const savedToken = localStorage.getItem('book-library-user-token');
    console.log('user saved token: ', savedToken);
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token === null ? (
          <button onClick={() => setPage('login')}>login</button>
        ) : (
          <>
            <button onClick={() => setPage('recommendations')}>
              recommended
            </button>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={logout}>logout</button>
          </>
        )}
      </div>

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} />

      <Recommendations show={page === 'recommendations'} />

      <NewBook show={page === 'add'} />

      <LoginForm
        setPage={setPage}
        setToken={setToken}
        show={page === 'login'}
      />
    </div>
  );
};

export default App;
