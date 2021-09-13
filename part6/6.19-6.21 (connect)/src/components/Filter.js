import React from 'react';
import { connect } from 'react-redux';
import { addFilter } from '../reducers/filterReducer';

const Filter = (props) => {
  const handleChange = (event) => {
    const text = event.target.value;
    // console.log(text);
    props.addFilter(text);
  };

  return (
    <div>
      filter <input onChange={handleChange} />
    </div>
  );
};

const mapDispatchToProps = {
  addFilter,
};

const ConnectedFilter = connect(null, mapDispatchToProps)(Filter);
export default ConnectedFilter;
