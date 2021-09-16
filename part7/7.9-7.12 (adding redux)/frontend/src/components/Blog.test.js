import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import Blog from './Blog';

test('renders content, only title and author', () => {
  const blog = {
    title:
      'Biden administration tells ex-Trump officials to resign from military academy advisory boards or be dismissed',
    author: 'Andrew Kaczynski',
    url: 'https://edition.cnn.com/2021/09/08/politics/trump-appointees-biden-boards/index.html',
    likes: 12,
    user: {
      id: '613441d4ea7a1d3deefabe7f',
      name: 'John Taggart',
      username: 'john1995',
    },
  };

  const user = {
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG4xOTk1IiwiaWQiOiI2MTM0NDFkNGVhN2ExZDNkZWVmYWJlN2YiLCJpYXQiOjE2MzEwNzIyNzV9.RCO46r1aQ43LpIy2hxa-8suj20jxs4GOkMJM8JpOPM4',
    username: 'john1995',
    name: 'John Taggart',
  };

  const component = render(<Blog blog={blog} user={user} />);

  expect(component.container).toHaveTextContent(
    'Biden administration tells ex-Trump officials to resign from military academy advisory boards or be dismissed'
  );
  expect(component.container).toHaveTextContent('Andrew Kaczynski');

  const div = component.container.querySelector('.details');
  expect(div).toHaveStyle('display: none');
});

test('renders content, url and likes after clicking show', () => {
  const blog = {
    title:
      'Biden administration tells ex-Trump officials to resign from military academy advisory boards or be dismissed',
    author: 'Andrew Kaczynski',
    url: 'https://edition.cnn.com/2021/09/08/politics/trump-appointees-biden-boards/index.html',
    likes: 12,
    user: {
      id: '613441d4ea7a1d3deefabe7f',
      name: 'John Taggart',
      username: 'john1995',
    },
  };

  const user = {
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG4xOTk1IiwiaWQiOiI2MTM0NDFkNGVhN2ExZDNkZWVmYWJlN2YiLCJpYXQiOjE2MzEwNzIyNzV9.RCO46r1aQ43LpIy2hxa-8suj20jxs4GOkMJM8JpOPM4',
    username: 'john1995',
    name: 'John Taggart',
  };

  const component = render(<Blog blog={blog} user={user} />);

  const button = component.getByText('show');
  fireEvent.click(button);

  const div = component.container.querySelector('.details');
  expect(div).not.toHaveStyle('display: none');
});
