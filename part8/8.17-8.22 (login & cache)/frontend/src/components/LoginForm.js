import React, { useState, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';

const LoginForm = ({ setPage, setToken, show }) => {
  // setToken indicates that user has signed in
  const LOGIN = gql`
    mutation LoginMutation($loginUsername: String!, $loginPassword: String!) {
      login(username: $loginUsername, password: $loginPassword) {
        value
      }
    }
  `;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message);
    },
  });

  const submit = async (event) => {
    event.preventDefault();

    console.log('login...');
    login({
      variables: {
        loginUsername: username,
        loginPassword: password,
      },
    });
  };

  useEffect(() => {
    if (result.data) {
      // when signing in successfull, do 2 things: save local storage items and save/change to related states
      const token = result.data.login.value;
      console.log('user token: ', token);
      setToken(token);
      setPage('authors');
      localStorage.setItem('book-library-user-token', token);
    }
  }, [result.data, setToken, setPage]); // eslint-disable-line

  if (!show) {
    return null;
  }

  return (
    <div>
      <h2>login</h2>

      <form onSubmit={submit}>
        <div>
          username
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type='password'
            autoComplete='off'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  );
};

export default LoginForm;
