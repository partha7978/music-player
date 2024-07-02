import React, { useState, useRef, useEffect } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import NextIcon from "../../assets/next.svg";
import PauseIcon from "../../assets/pause.svg";
import PlayIcon from "../../assets/play.svg";
import PreviousIcon from "../../assets/previous.svg";
import SoundIcon from "../../assets/sound.svg";
import ThreeDotIcon from "../../assets/threeDot.svg";

const SongDetails = () => {

  const ref = useRef<HTMLAudioElement>(null);

  const [song, setSong] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);

    if (isPlaying) {
      ref.current?.play();
    } else {
      ref.current?.pause();
    }
  };
  return (
    <>
      <div className="song-details__container">
        <div className="song-details">
          <p className="song-name">Song Name</p>
          <p className="artist-name">Artist Name</p>
        </div>
        <div className="song-image">
          <img
            src="https://images.unsplash.com/photo-1608739871923-7da6d372f3c2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTgzfHxmYXNoaW9ufGVufDB8MHwwfHx8MA%3D%3D"
            alt="Album Cover"
            className="album-cover"
          />
        </div>
        <div className="song-action">
          <div className="progressbar">
            <div className="progress"></div>
          </div>
          <div className="action">
            <button className="info-btn">
              <HiOutlineDotsHorizontal />
            </button>
            <div className="main-action">
              <button className="previous">
                <img src={PreviousIcon} alt="Sound Icon" />
              </button>
              <button className="play-pause-btn" onClick={handlePlayPause}>
                <img src={isPlaying ? PauseIcon : PlayIcon} alt="Sound Icon" />
              </button>
              <button className="next">
                <img src={NextIcon} alt="Sound Icon" />
              </button>
            </div>
            <button className="sound">
              <img src={SoundIcon} alt="Sound Icon" />
            </button>
          </div>
        </div>
      </div>

      <audio ref={ref} src="https://pub-172b4845a7e24a16956308706aaf24c2.r2.dev/illusion-feel-ambient-guitar-146100.mp3" />


      <div className="song-details__mobile">
        <div className="mobile__container">
          <div className="song-details__section">
            <div className="song-image">
              <img
                src="https://images.unsplash.com/photo-1608739871923-7da6d372f3c2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTgzfHxmYXNoaW9ufGVufDB8MHwwfHx8MA%3D%3D"
                alt="Album Cover"
                className="album-cover"
              />
            </div>
            <div className="song-details">
              <p className="song-name">Song Name</p>
              <p className="artist-name">Artist Name</p>
            </div>
          </div>
          <div className="action">
            {/* <button className="info-btn">
              <HiOutlineDotsHorizontal />
            </button> */}
            <div className="main-action">
              <button className="previous">
                <img src={PreviousIcon} alt="Sound Icon" />
              </button>
              <button className="play-pause-btn">
                <img src={PlayIcon} alt="Sound Icon" />
              </button>
              <button className="next">
                <img src={NextIcon} alt="Sound Icon" />
              </button>
            </div>
            {/* <button className="sound">
              <img src={SoundIcon} alt="Sound Icon" />
            </button> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default SongDetails;
