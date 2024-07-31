import React from 'react';

const NewGameButton = () => {
  const handleNewGame = () => {
    window.location.href = 'https://typeracer-phoenix.netlify.app'; // Navigate to the home page
  };

  return (
    <button onClick={handleNewGame} className="btn btn-secondary mb-3">
      New Game
    </button>
  );
};

export default NewGameButton;
