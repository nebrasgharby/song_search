// Importation des modules nécessaires
const express = require('express'); // Framework pour créer l'API
const router = express.Router(); // Création du routeur Express
const Client = require('../config/genius'); // Client pour l'API Genius
const axios = require('axios'); // Pour faire des requêtes HTTP
const cheerio = require('cheerio'); // Pour parser le HTML
const natural = require('natural'); // Pour le traitement NLP (TF-IDF)

// Définition de la route GET '/search'
router.get('/search', async (req, res) => {
  try {
    // Récupération des paramètres de requête
    const { q: query, type } = req.query;

    // Vérification que les paramètres requis sont présents
    if (!query || !type) {
      return res.status(400).json({ error: 'Missing query or type' });
    }

    // Recherche des chansons via l'API Genius
    const results = await Client.songs.search(query);
    // On ne garde que les 5 premiers résultats pour limiter le traitement
    const topSongs = results.slice(0, 5);

    // Initialisation du TF-IDF
    const TfIdf = natural.TfIdf;
    const tfidf = new TfIdf();
    const songData = []; // Stockera les données des chansons

    // Pour chaque chanson trouvée...
    for (let song of topSongs) {
      let lyrics = '';
      try {
        // Récupération des paroles via scraping
        const response = await axios.get(song.url);
        const $ = cheerio.load(response.data);
        // Extraction du texte des paroles depuis le HTML
        lyrics = $('div[data-lyrics-container]').text();
      } catch (err) {
        console.error(`Échec de récupération des paroles pour ${song.title}`);
      }

      // On prépare le texte à analyser selon le type demandé
      const text = type === 'lyrics' ? lyrics : `${song.title} ${song.artist.name}`;
      
      // Ajout du document (paroles ou titre+artiste) au modèle TF-IDF
      tfidf.addDocument(text);
      
      // Stockage des données de la chanson
      songData.push({
        title: song.title,
        artist: song.artist.name,
        url: song.url,
        image: song.image,
        thumbnail: song.thumbnail,
        content: text
      });
    }

    // Ajout de la requête utilisateur comme document supplémentaire pour comparaison
    tfidf.addDocument(query);
    const queryIndex = tfidf.documents.length - 1; // Index du document requête

    // Fonction de calcul de similarité cosinus
    const cosineSimilarity = (vecA, vecB) => {
      // Produit scalaire
      const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
      // Norme des vecteurs
      const magnitudeA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
      const magnitudeB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
      // Éviter la division par 0
      if (magnitudeA === 0 || magnitudeB === 0) return 0;
      // Calcul final de la similarité
      return dotProduct / (magnitudeA * magnitudeB);
    };

    // Calcul des similarités pour chaque chanson
    const similarities = songData.map((song, index) => {
      const songVector = [];
      const queryVector = [];
      
      // Construction des vecteurs TF-IDF pour comparaison
      tfidf.listTerms(index).forEach(term => {
        songVector.push(term.tfidf);
        const match = tfidf.listTerms(queryIndex).find(t => t.term === term.term);
        queryVector.push(match ? match.tfidf : 0);
      });

      // Calcul de la similarité cosinus
      const similarity = cosineSimilarity(songVector, queryVector);
      
      // Retourne les données de la chanson avec son score de similarité
      return { ...song, similarity: similarity.toFixed(2) };
    }).filter(s => s.similarity > 0); // Filtre les similarités nulles

    // Renvoi des résultats au format JSON
    res.json(similarities);
  } catch (err) {
    console.error('Erreur dans la recherche par similarité:', err);
    res.status(500).json({ error: 'Échec du traitement de la recherche' });
  }
});

// Export du routeur pour utilisation dans l'application principale
module.exports = router;