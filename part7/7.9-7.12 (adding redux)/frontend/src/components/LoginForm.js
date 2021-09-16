import React from 'react';

const LoginForm = ({
  username,
  password,
  setUsername,
  setPassword,
  handleLogin,
}) => {
  return (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          id='username'
          type='text'
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id='password'
          type='password'
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          autoComplete='on'
        />
      </div>
      <button id='login-button' type='submit'>
        login
      </button>
    </form>
  );
};

export default LoginForm;
