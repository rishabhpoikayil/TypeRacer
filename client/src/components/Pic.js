import React from 'react';
import './Pic.css';

const Pic = () => {
  return (
    <div className="image-container">
      <img className="resized-image" src="/images/home_pic.jpg" alt="Welcome!" />
    </div>
  );
};

export default Pic;