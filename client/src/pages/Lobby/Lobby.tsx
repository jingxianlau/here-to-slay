import React from 'react';
import { Link } from 'react-router-dom';

function Lobby() {
  return (
    <div>
      <Link to='create'>Create Match</Link>
      <Link to='find'>Find Matches</Link>

      <button>Join Match</button>
      <input></input>
    </div>
  );
}

export default Lobby;
