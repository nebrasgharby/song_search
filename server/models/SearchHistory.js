'use strict';

const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
  query: { 
    type: String, 
    required: true,
    index: true 
  },
  searchType: { 
    type: String, 
    required: true, 
    enum: ['title', 'lyrics', 'artist'],
    index: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now,
    index: true 
  }
});

module.exports = mongoose.model('SearchHistory', searchHistorySchema);