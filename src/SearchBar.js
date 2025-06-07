import React, { useState, useEffect } from 'react';
import { searchSongs, fetchHistory, saveSearch } from './api';

function SearchBar({ setResults }) {
  // États du composant
  const [query, setQuery] = useState(''); // Terme de recherche
  const [type, setType] = useState('title'); // Type de recherche (titre/paroles/artiste)
  const [history, setHistory] = useState([]); // Historique des recherches
  const [showHistory, setShowHistory] = useState(false); // Affichage de l'historique
  const [isSearching, setIsSearching] = useState(false); // État de chargement

  // Fonction principale de recherche
  const handleSearch = async (q = query, t = type) => {
    if (!q.trim()) return; // Ne rien faire si la requête est vide
    
    setIsSearching(true);
    try {
      // Appel à l'API pour rechercher les chansons
      const results = await searchSongs(q, t);
      
      // Filtrage des résultats sans similarité
      const filtered = results.filter(song => parseFloat(song.similarity) > 0);
      
      // Mise à jour des résultats dans le composant parent
      setResults(filtered);
      
      // Sauvegarde de la recherche dans l'historique
      await saveSearch(q, t);
      setQuery('');
      
      // Rafraîchissement de l'historique
      refreshHistory();
    } catch (error) {
      console.error("Erreur de recherche:", error);
    } finally {
      setIsSearching(false);
      setShowHistory(false);
    }
  };

  // Gestion de la touche Entrée
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Sélection d'un élément de l'historique
  const handleHistoryClick = (item) => {
    setQuery(item.query);
    setType(item.searchType);
    setShowHistory(false);
  };

  // Rafraîchissement de l'historique
  const refreshHistory = () => {
    fetchHistory().then(setHistory);
  };

  // Effet pour charger l'historique au montage
  useEffect(() => {
    refreshHistory();
  }, []);

  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <div className="search-input-group">
          {/* Champ de recherche principal */}
          <input
            type="text"
            value={query}
            placeholder={`Recherche par ${type}...`}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowHistory(true)}
            onBlur={() => setTimeout(() => setShowHistory(false), 200)}
            className="search-input"
          />

          <div className="search-controls">
            {/* Sélecteur de type de recherche */}
            <select
              onChange={(e) => setType(e.target.value)}
              value={type}
              className="search-type-select"
            >
              <option value="title">Titre</option>
              <option value="lyrics">Paroles</option>
              <option value="artist">Artiste</option>
            </select>

            {/* Bouton de recherche */}
            <button
              onClick={() => handleSearch()}
              disabled={isSearching || !query.trim()}
              className="search-button"
            >
              {isSearching ? (
                <>
                  <span className="spinner"></span>
                  Recherche...
                </>
              ) : (
                <>
                  <span className="search-icon">🔍</span>
                  Rechercher
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown d'historique des recherches */}
      {showHistory && history.length > 0 && (
        <div className="search-history-dropdown">
          <div className="history-header">
            <h4>Recherches récentes</h4>
            <button onClick={() => setShowHistory(false)} className="close-history">×</button>
          </div>
          <ul className="history-list">
            {history.map((item, index) => (
              <li
                key={index}
                onMouseDown={() => handleHistoryClick(item)}
                className="history-item"
              >
                <span className="history-icon">↻</span>
                <span className="history-query">{item.query}</span>
                <span className="history-type">{item.searchType}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <style jsx>{`
        body {
          font-family: 'Segoe UI', sans-serif;
          background-color: #f4f6fa;
        }

        h1 {
          text-align: center;
          color: #6a5acd;
          font-size: 2.5rem;
          font-weight: bold;
        }

        .search-bar-container {
          position: relative;
          max-width: 800px;
          margin: 2rem auto;
          padding: 1rem;
        }

        .search-bar {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          padding: 1.5rem;
        }

        .search-input-group {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .search-input {
          padding: 0.8rem 1rem;
          border: 2px solid #e0e6ed;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s;
        }

        .search-input:focus {
          outline: none;
          border-color: #6a5acd;
          box-shadow: 0 0 0 3px rgba(106,90,205,0.2);
        }

        .search-controls {
          display: flex;
          gap: 0.5rem;
        }

        .search-type-select {
          flex: 1;
          padding: 0.8rem;
          border: 2px solid #e0e6ed;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          background-color: white;
        }

        .search-button {
          padding: 0.8rem 1.5rem;
          background-color: #6a5acd;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s;
        }

        .search-button:hover:not(:disabled) {
          background-color: #5a4abc;
          transform: translateY(-1px);
        }

        .search-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner {
          display: inline-block;
          width: 1rem;
          height: 1rem;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .search-history-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border-radius: 0 0 12px 12px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
          z-index: 100;
          margin-top: -0.5rem;
          overflow: hidden;
        }

        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.8rem 1rem;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
        }

        .history-header h4 {
          margin: 0;
          font-size: 0.9rem;
          color: #495057;
        }

        .close-history {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          color: #6c757d;
        }

        .history-list {
          list-style: none;
          padding: 0;
          margin: 0;
          max-height: 300px;
          overflow-y: auto;
        }

        .history-item {
          padding: 0.8rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .history-item:hover {
          background-color: #f8f9fa;
          transform: translateX(2px);
        }

        .history-icon {
          color: #6a5acd;
          font-size: 1rem;
        }

        .history-query {
          flex: 1;
          font-weight: 500;
        }

        .history-type {
          background: #f0eefc;
          color: #6a5acd;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
        }
      `}</style>
    </div>
  );
}

export default SearchBar;
