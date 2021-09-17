import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BlogForm from './BlogForm';

test('<BlogForm /> updates parent state and calls onSubmit', () => {
  const handleCreate = jest.fn();

  const component = render(<BlogForm handleCreate={handleCreate} />);

  const title = component.container.querySelector('#title');
  const author = component.container.querySelector('#author');
  const url = component.container.querySelector('#url');
  const form = component.container.querySelector('form');

  fireEvent.change(title, {
    target: { value: 'Deep Dive Into Modern Web Development' },
  });
  fireEvent.change(author, {
    target: { value: 'University of Helsinki' },
  });
  fireEvent.change(url, {
    target: { value: 'https://fullstackopen.com/en/' },
  });
  fireEvent.submit(form);

  expect(handleCreate.mock.calls).toHaveLength(1);
  console.log(handleCreate.mock.calls[0][1]);

  // second props of handleCreate()
  expect(handleCreate.mock.calls[0][1]).toBe(
    'Deep Dive Into Modern Web Development'
  );

  // third props of handleCreate()
  expect(handleCreate.mock.calls[0][2]).toBe('University of Helsinki');

  // fourth props of handleCreate()
  expect(handleCreate.mock.calls[0][3]).toBe('https://fullstackopen.com/en/');
});
