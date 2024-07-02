import React, { useState, useRef, useEffect } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import NextIcon from "../../assets/next.svg";
import PauseIcon from "../../assets/pause.svg";
import PlayIcon from "../../assets/play.svg";
import PreviousIcon from "../../assets/previous.svg";
import SoundIcon from "../../assets/sound.svg";
import ThreeDotIcon from "../../assets/threeDot.svg";
import { useDispatch, useSelector } from "react-redux";

const SongDetails = () => {
  const playSong = useSelector((state) => state.currentSong?.items);
  const ref = useRef();

  const [song, setSong] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressBar, setProgressBar] = useState(0);

  useEffect(() => {
    if (playSong && playSong.url) {
      setSong(playSong);
      console.log(playSong, 'playSong');
      ref.current?.load();
    }
  }, [playSong]);

  const handlePlayPause = () => {
    if (isPlaying) {
      ref.current?.play();
    } else {
      ref.current?.pause();
    }
    setIsPlaying(!isPlaying);
  };

  const handleLoadedData = () => {
    ref.current?.play();
    console.log(ref.current.duration, 'duration');

    const progressBar = (ref.current.currentTime / ref.current.duration) * 100;
    setProgressBar(progressBar);
    console.log(progressBar, 'progressBar');
    setIsPlaying(false);
  };

  useEffect(() => {
    if (playSong && playSong.url) {
      setSong(playSong);
      ref.current?.load();
    }
  }, [playSong]);

  const handleTimeUpdate = () => {
    const currentTime = ref.current.currentTime;
    const duration = ref.current.duration;
    const progress = (currentTime / duration) * 100;
    setProgressBar(progress);
  };

  useEffect(() => {
    const currentRef = ref.current;
    currentRef.addEventListener("timeupdate", handleTimeUpdate);
    
    return () => {
      currentRef.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);


  return (
    <>
      <div className="song-details__container">
        <div className="song-details">
          <p className="song-name">Song Name</p>
          <p className="artist-name">Artist Name</p>
        </div>
        <div className="song-image">
          <img
            src={
              song.cover
                ? `https://cms.samespace.com/assets/${song.cover}`
                : "https://images.unsplash.com/photo-1608739871923-7da6d372f3c2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTgzfHxmYXNoaW9ufGVufDB8MHwwfHx8MA%3D%3D"
            }
            alt="Album Cover"
            className="album-cover"
          />
        </div>
        <div className="song-action">
          <div className="progressbar">
            <div className="progress">
              <div
                className="bar"
                style={{ width: `${progressBar}%`, backgroundColor: `${song.accent}` }}  
              ></div>
            </div>
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

      <audio ref={ref} src={song.url} onLoadedData={handleLoadedData} />

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
