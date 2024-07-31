import React from 'react';
import { useNavigate } from 'react-router-dom';

const NewGameButton = () => {
  const navigate = useNavigate();

  const handleNewGame = () => {
    navigate('https://typeracer-phoenix.netlify.app');
  };

  return (
    <button onClick={handleNewGame} className="btn btn-secondary mb-3">
      New Game
    </button>
  );
};

export default NewGameButton;
