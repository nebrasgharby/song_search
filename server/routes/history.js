'use strict';

const express = require('express');
const router = express.Router();
const SearchHistory = require('../models/SearchHistory');

// Sauvegarder une recherche
router.post('/', async (req, res) => {
  try {
    const { query, searchType } = req.body;
    
    if (!query || !searchType) {
      return res.status(400).json({ error: 'Query and searchType are required' });
    }

    const historyItem = new SearchHistory({ query, searchType });
    await historyItem.save();
    
    res.status(201).json(historyItem);
  } catch (error) {
    console.error('Save history error:', error);
    res.status(500).json({ error: 'Failed to save search history' });
  }
});

// Récupérer l'historique
router.get('/', async (req, res) => {
  try {
    const history = await SearchHistory
      .find()
      .sort({ timestamp: -1 })
      .limit(10)
      .lean();
      
    res.json(history);
  } catch (error) {
    console.error('Fetch history error:', error);
    res.status(500).json({ error: 'Failed to fetch search history' });
  }
});

module.exports = router;