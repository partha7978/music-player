import React from "react";
import { FiSearch } from "react-icons/fi";
const SongList = () => {
  return (
    <div className="song-list__container">
      <div className="navigation-item__container">
        <a href="http://">For You</a>
        <a href="http://">Top Tracks</a>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Song, Artist"
          className="search-bar__input"
        />
        <button className="search-bar__button"><FiSearch /></button>
      </div>

      <div className="song-list__items">
        <div className="song-list__item">
          <img
            src="https://images.unsplash.com/photo-1608739871923-7da6d372f3c2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTgzfHxmYXNoaW9ufGVufDB8MHwwfHx8MA%3D%3D"
            alt="Album Cover"
            className="album-cover"
          />
          <div className="song-details">
            <p className="song-name">Song Name</p>
            <p className="artist-name">Artist Name</p>
          </div>
          <div className="song-duration">
            <p className="song-name">3:45</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongList;
