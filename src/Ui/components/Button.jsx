import React from 'react';

export const Button =({ label = 'Generate', onClick, className }) => {
  return (
    <div className={`button-wrap ${className}`}>
      <div className="button-shadow"></div>
      <button onClick={onClick} onTouchStart={onClick}>
        <span>{label}</span>
      </button>
    </div>
  );
}