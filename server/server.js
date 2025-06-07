'use strict';

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const historyRoutes = require('./routes/history');
const songsRoutes = require('./routes/songs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connexion MongoDB avec options modernes
mongoose.connect('mongodb://localhost:27017/songSearchDB')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/history', historyRoutes);
app.use('/api/songs', songsRoutes);

// Route de test
app.get('/', (req, res) => {
  res.send('Song Search API is running');
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;