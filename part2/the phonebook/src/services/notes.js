import axios from 'axios';
const baseURL = 'http://localhost:3001/persons';

const getAll = () => {
  const response = axios.get(baseURL);
  return response.then((response) => response.data);
};

const create = (newObject) => {
  const response = axios.post(baseURL, newObject);
  return response.then((response) => response.data);
};

const remove = (id) => {
  const response = axios.delete(`${baseURL}/${id}`);
  return response.then((response) => response.data);
};

const update = (id, newObject) => {
  const response = axios.put(`${baseURL}/${id}`, newObject);
  return response.then((response) => response.data);
};

const notes = { getAll, create, remove, update };

export default notes;
