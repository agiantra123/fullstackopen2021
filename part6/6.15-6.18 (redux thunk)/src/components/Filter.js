import React from 'react';
import { useDispatch } from 'react-redux';
import { addFilter } from '../reducers/filterReducer';

const Filter = () => {
  const dispatch = useDispatch();

  const handleChange = (event) => {
    const text = event.target.value;
    // console.log(text);
    dispatch(addFilter(text));
  };

  return (
    <div>
      filter <input onChange={handleChange} />
    </div>
  );
};

export default Filter;
