import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const searchSongs = async (query, type) => {
  const res = await API.get(`/songs/search?q=${query}&type=${type}`);
  return res.data;
};

export const fetchHistory = async () => {
  const res = await API.get('/history');
  return res.data;
};

export const saveSearch = async (query, searchType) => {
  await API.post('/history', { query, searchType });
};
