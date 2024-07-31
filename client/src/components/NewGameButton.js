import React from 'react';

const NewGameButton = () => {

  const handleClick = () => {
    window.location.reload()
  };

  return (
    <button onClick={handleClick} className="btn btn-secondary mb-3">
      New Game
    </button>
  );
};

export default NewGameButton;
