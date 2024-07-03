import { useState, useRef, useEffect } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import NextIcon from "../../assets/next.svg";
import PauseIcon from "../../assets/pause.svg";
import PlayIcon from "../../assets/play.svg";
import PreviousIcon from "../../assets/previous.svg";
import SoundIcon from "../../assets/sound.svg";
import { useDispatch, useSelector } from "react-redux";
import { addCurrentSong } from "../../store/currentSongSlice";
import { FaVolumeMute } from "react-icons/fa";

const SongDetails = () => {
  const dispatch = useDispatch();
  const songList = useSelector((state) => state.songList?.items);
  const playSong = useSelector((state) => state.currentSong?.items);
  const ref = useRef();

  const [song, setSong] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressBar, setProgressBar] = useState(0);

  useEffect(() => {
    if (playSong && playSong.url) {
      setSong(playSong);
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

    const progressBar = (ref.current.currentTime / ref.current.duration) * 100;
    setProgressBar(progressBar);
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

  const handleProgressBar = (e) => {
    const progressBarWidth = e.target.getBoundingClientRect().width;

    const clickX = e.nativeEvent.offsetX;
    const seek = (clickX / progressBarWidth) * ref.current.duration;

    ref.current.currentTime = seek;
  };

  const handleNextPrevious = (type) => {
    let newIndex;
    if (type === "next") {
      newIndex = song.index + 1;
    } else {
      newIndex = song.index - 1;
    }

    const newSong = songList[0][newIndex];
    setSong(newSong);

    dispatch(addCurrentSong(newSong));
  };

  const handleSound = () => {
    ref.current.muted = !ref.current.muted;
  };

  return (
    <>
      <div className="song-details__container">
        {Object.keys(song).length === 0 ? (
          <div className="no-songs__container">
            <h1 className="song-title">Play Your Favorite Song 😌</h1>
          </div>
        ) : (
          <>
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
                <div className="progress" onClick={handleProgressBar}>
                  <div
                    className="bar"
                    style={{
                      width: `${progressBar}%`,
                      backgroundColor: `${song.accent}`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="action">
                <button className="info-btn" onClick={() => alert('This Feature Is Coming Soon')}>
                  <HiOutlineDotsHorizontal />
                </button>
                <div className="main-action">
                  <button
                    className={`previous ${song.index === 0 ? "disabled" : ""}`}
                    disabled={song ? song.index === 0 : false}
                    onClick={() => handleNextPrevious("prev")}
                  >
                    <img src={PreviousIcon} alt="Sound Icon" />
                  </button>
                  <button className="play-pause-btn" onClick={handlePlayPause}>
                    <img
                      src={isPlaying ? PauseIcon : PlayIcon}
                      alt="Sound Icon"
                    />
                  </button>
                  <button
                    className={`next ${
                      song.index === songList[0]?.length - 1 ? "disabled" : ""
                    }`}
                    disabled={
                      song ? song.index === songList[0]?.length - 1 : false
                    }
                    onClick={() => handleNextPrevious("next")}
                  >
                    <img src={NextIcon} alt="Sound Icon" />
                  </button>
                </div>
                <button className="sound" onClick={handleSound}>
                    {ref.current.muted ? <FaVolumeMute  /> :   <img src={SoundIcon} alt="Sound Icon" />}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <audio ref={ref} src={song.url} onLoadedData={handleLoadedData} />

      <div className="song-details__mobile">
       {Object.keys(song).length === 0 ? (
         <div className="no-songs__container">
           <p className="song-title">Play Your Favorite Song 😌</p>
         </div>
       ): (
        <div className="mobile__container">
        <div className="song-details__section">
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
          <div className="song-details">
          <p className="song-name">{song.name}</p>
          <p className="artist-name">{song.artist}</p>
          </div>
        </div>
        <div className="action">
          <div className="main-action">
            <button
              className={`previous ${song.index === 0 ? "disabled" : ""}`}
              disabled={song ? song.index === 0 : false}
              onClick={() => handleNextPrevious("prev")}
            >
              <img src={PreviousIcon} alt="Sound Icon" />
            </button>
            <button className="play-pause-btn" onClick={handlePlayPause}>
              <img src={isPlaying ? PauseIcon : PlayIcon} alt="Sound Icon" />
            </button>
            <button
              className={`next ${
                song.index === songList[0]?.length - 1 ? "disabled" : ""
              }`}
              disabled={song ? song.index === songList[0]?.length - 1 : false}
              onClick={() => handleNextPrevious("next")}
            >
              <img src={NextIcon} alt="Sound Icon" />
            </button>
          </div>
        </div>
      </div>
       )}
      </div>
    </>
  );
};

export default SongDetails;
