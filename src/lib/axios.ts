import axios from 'axios';

const api = axios.create({
  baseURL: 'https://63bedcf7f5cfc0949b634fc8.mockapi.io',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
