import React, { useState } from 'react';
import SearchBar from './SearchBar';
import SearchResult from './SearchResult';
import './style.css';

function App() {
  const [results, setResults] = useState([]);

  return (
    <div className="app">
      <h1>Samma3ni 🎵</h1>
      <SearchBar setResults={setResults} />
      <SearchResult results={results} />
    </div>
  );
}

export default App;
