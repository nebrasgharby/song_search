import React from 'react';

function SearchResult({ results }) {
  if (!results.length) return null;

  // Sort results by similarity (highest first)
  const sortedResults = [...results].sort((a, b) => {
    const similarityA = parseFloat(a.similarity) * 100;
    const similarityB = parseFloat(b.similarity) * 100;
    return similarityB - similarityA; // Descending order
  });

  return (
    <div className="results-container">
      {sortedResults.map((song, i) => (
        <div className="song-card" key={i}>
          <div className="song-rank" aria-label={`Rank ${i + 1}`}>{i + 1}</div>
          <div className="image-container">
            <img 
              src={song.image || song.thumbnail || 'default-music-placeholder.png'} 
              alt={`Cover art for ${song.title}`}
              className="song-image"
              onError={(e) => {
                e.target.src = 'default-music-placeholder.png';
              }}
            />
          </div>
          <div className="song-details">
            <h3 className="song-title">{song.title}</h3>
            <p className="song-artist">👤 {song.artist}</p>
            <div className="similarity-container">
              <div className="similarity-bar" style={{
                width: `${(parseFloat(song.similarity) * 100)}%`,
                backgroundColor: `hsl(${parseFloat(song.similarity) * 120}, 70%, 50%)`
              }}></div>
              <span className="similarity-value">
                {(parseFloat(song.similarity) * 100).toFixed(1)}%
              </span>
            </div>
            <a 
              href={song.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="listen-button"
              aria-label={`Listen to ${song.title} by ${song.artist}`}
            >
              🎧 Listen
            </a>
          </div>
        </div>
      ))}

      <style jsx>{`
        .results-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .song-card {
          position: relative;
          display: flex;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }

        .song-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.15);
        }

        .song-rank {
          position: absolute;
          top: 10px;
          left: 10px;
          background: #6a5acd;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.8rem;
          z-index: 2;
        }

        .image-container {
          width: 120px;
          height: 120px;
          flex-shrink: 0;
          overflow: hidden;
        }

        .song-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .song-card:hover .song-image {
          transform: scale(1.1);
        }

        .song-details {
          flex: 1;
          padding: 1rem;
          display: flex;
          flex-direction: column;
        }

        .song-title {
          margin: 0 0 0.3rem;
          font-size: 1rem;
          color: #333;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .song-artist {
          margin: 0 0 0.8rem;
          color: #666;
          font-size: 0.85rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .similarity-container {
          margin-bottom: 1rem;
          position: relative;
          height: 20px;
          background: #f0f0f0;
          border-radius: 10px;
          overflow: hidden;
        }

        .similarity-bar {
          height: 100%;
          border-radius: 10px;
          transition: width 0.5s ease;
        }

        .similarity-value {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.7rem;
          font-weight: bold;
          color: white;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }

        .listen-button {
          display: inline-block;
          padding: 0.5rem 1rem;
          background-color: #6a5acd;
          color: white;
          text-align: center;
          border-radius: 8px;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 500;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          margin-top: auto;
          align-self: flex-start;
        }

        .listen-button:hover {
          background-color: #5a4abc;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(106, 90, 205, 0.3);
        }

        @media (max-width: 600px) {
          .image-container {
            width: 80px;
            height: 80px;
          }
          
          .song-details {
            padding: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}

export default SearchResult;