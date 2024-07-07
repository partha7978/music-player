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
  const [songListWithIndex, setSongListWithIndex] = useState([]);

  // setting the current playing song
  useEffect(() => {
    if (playSong && playSong.url) {
      setSong(playSong);
      ref.current?.load();
    }
  }, [playSong]);

  // setting the songList with index
  useEffect(() => {
    if (songList && songList.length > 0) {
      setSongsWithIndex(songList[0]);
    }
  }, [songList]);

  // function to set the index
  const setSongsWithIndex = async (songList) => {
    const songsWithDuration = await Promise.all(
      songList && songList.map(async (song, index) => {
        const audio = new Audio(song.url);
        await new Promise((resolve) => {
          audio.addEventListener("loadedmetadata", () => {
            resolve();
          });
        });

        return { ...song, index };
      })
    );
    setSongListWithIndex(songsWithDuration);
  };

  // function to handle play and pause
  const handlePlayPause = () => {
    if (isPlaying) {
      ref.current?.play();
    } else {
      ref.current?.pause();
    }
    setIsPlaying(!isPlaying);
  };

  //handling progressbar
  const handleLoadedData = () => {
    ref.current?.play();

    const progressBar = (ref.current.currentTime / ref.current.duration) * 100;
    setProgressBar(progressBar);
    setIsPlaying(false);
  };

  // function to handle real time show of song progress
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

  // function to handle progressbar when user click on any part of it and setting the song accordingly
  const handleProgressBar = (e) => {
    const progressBarWidth = e.target?.getBoundingClientRect()?.width;

    const clickX = e.nativeEvent?.offsetX;
    const seek = (clickX / progressBarWidth) * ref.current.duration;

    ref.current.currentTime = seek;
  };

  // function to handle next and previous
  const handleNextPrevious = (type) => {
    if (!playSong) return;

    // Find the current song in songListWithIndex
    const currentSongIndex = songListWithIndex.findIndex(
      (song) => song.id === playSong.id
    );
    if (currentSongIndex !== undefined) {
      let newIndex;
      if (type === "next") {
        newIndex = currentSongIndex + 1;
      } else {
        newIndex = currentSongIndex - 1;
      }
      const newSong = songListWithIndex[newIndex];
      setSong(newSong);
      dispatch(addCurrentSong(newSong));
    }
  };

  // function to handle volume
  const handleSound = () => {
    ref.current.muted = !ref.current.muted;
  };

  return (
    <>
      <div className="song-details__container">
        {Object.keys(song).length === 0 ? (
          <div className="no-songs__container">
            <h1 className="song-title">Play Your Favorite Song 🎸</h1>
          </div>
        ) : (
          <>
            <div className="song-details">
              <p className="song-name">{song.name}</p>
              <p className="artist-name">{song.artist}</p>
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
                <button
                  className="info-btn"
                  aria-label="More Info"
                  onClick={() => alert("This Feature Is Coming Soon")}
                >
                  <HiOutlineDotsHorizontal />
                </button>
                <div className="main-action">
                  <button
                    aria-label="Previous Song"
                    className={`previous ${song.index === 0 ? "disabled" : ""}`}
                    disabled={song ? song === songListWithIndex[0] : false}
                    onClick={() => handleNextPrevious("prev")}
                  >
                    <img src={PreviousIcon} alt="Sound Icon" />
                  </button>
                  <button
                    className="play-pause-btn"
                    onClick={handlePlayPause}
                    aria-label="Play/Pause"
                  >
                    <img
                      src={isPlaying ? PauseIcon : PlayIcon}
                      alt="Sound Icon"
                    />
                  </button>
                  <button
                    aria-label="Next Song"
                    className={`next ${
                      song.index === songList[0]?.length - 1 ? "disabled" : ""
                    }`}
                    disabled={
                      song
                        ? song ===
                          songListWithIndex[songListWithIndex.length - 1]
                        : false
                    }
                    onClick={() => handleNextPrevious("next")}
                  >
                    <img src={NextIcon} alt="Sound Icon" />
                  </button>
                </div>
                <button
                  className="sound"
                  aria-label="Sound"
                  onClick={handleSound}
                >
                  {ref.current.muted ? (
                    <FaVolumeMute />
                  ) : (
                    <img src={SoundIcon} alt="Sound Icon" />
                  )}
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
            <p className="song-title">Play Your Favorite Song 🎸</p>
          </div>
        ) : (
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
                  aria-label="Previous Song"
                  className={`previous ${song.index === 0 ? "disabled" : ""}`}
                  disabled={song ? song === songListWithIndex[0] : false}
                  onClick={() => handleNextPrevious("prev")}
                >
                  <img src={PreviousIcon} alt="Sound Icon" />
                </button>
                <button
                  className="play-pause-btn"
                  onClick={handlePlayPause}
                  aria-label="Play/Pause"
                >
                  <img
                    src={isPlaying ? PauseIcon : PlayIcon}
                    alt="Sound Icon"
                  />
                </button>
                <button
                  aria-label="Next Song"
                  className={`next ${
                    song.index === songList[0]?.length - 1 ? "disabled" : ""
                  }`}
                  disabled={
                    song
                      ? song === songListWithIndex[songListWithIndex.length - 1]
                      : false
                  }
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
