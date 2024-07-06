import { useEffect, useRef, useState, useCallback } from "react";
import { FiSearch } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { addSongList, clearAllSongList } from "../../store/songListSlice";
import {
  addCurrentSong,
  removeCurrentSong,
} from "../../store/currentSongSlice";
import useThrottle from "../hooks/useThrottle";

const SongList = () => {
  const API_URL = "https://cms.samespace.com/items/songs";
  const dispatch = useDispatch();
  const throttleSearch = useThrottle;
  const currentPlayingSong = useSelector((state) => state.currentSong?.items);

  const [inputIcon, setInputIcon] = useState(
    <FiSearch onClick={() => handleSearch(inputRef?.current?.value)} />
  );
  const [songList, setSongList] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [showTopTracks, setShowTopTracks] = useState(false);
  const [allSongsList, setAllSongsList] = useState(false);
  const [errorMsg, setErrMsg] = useState("");
  const inputRef = useRef();

  // function to set the duration
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // function to fetch songs
  const fetchSongs = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      await handleAllSongWithDuration(data.data);
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };

  //function to set duration for all songList. 
  const handleAllSongWithDuration = async (songs) => {
    const songsWithDuration = await Promise.all(
      songs.map(async (song) => {
        const audio = new Audio(song.url);
        await new Promise((resolve) => {
          audio.addEventListener("loadedmetadata", () => {
            song.duration = formatDuration(audio.duration);
            resolve();
          });
        });
        return song;
      })
    );

    setSongList(songsWithDuration);
    setAllSongsList(songsWithDuration);
    handleTabChange("all", songsWithDuration);

    // filtering for top tracks
    if (songsWithDuration.length > 0) {
      let topTracks = songsWithDuration.filter((song) => {
        return song["top_track"] === true;
      });

      setTopTracks(topTracks);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  // changing the background color based on current song
  useEffect(() => {
    if (currentPlayingSong) {
      const rgb = hexToRgb(currentPlayingSong.accent);
      const mainContainer =
        document.getElementsByClassName("main-container")[0];
      const mobileContainer = document.getElementsByClassName(
        "song-details__mobile"
      )[0];
      const dynamicBackground = `linear-gradient(235deg, #191414 -30%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1) 150%)`;
      const dynamicMobileBackground = `linear-gradient(235deg, #191414 -30%, ${currentPlayingSong.accent} 250%)`;
      if (mainContainer) {
        mainContainer.style.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`;
        document.querySelector("input").style.background = dynamicBackground;
        mobileContainer.style.background = dynamicMobileBackground;
      }
    }
  }, [currentPlayingSong]);

  //setting current playing song
  const setCurrentSong = (song) => {
    dispatch(removeCurrentSong());
    dispatch(addCurrentSong(song));
  };

  // function to convert hex to rgb as we are getting response as hex
  const hexToRgb = (hex = "#000000") => {
    hex = hex?.replace(/^#/, "");

    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    return { r, g, b };
  };

  // function to handle tab change
  const handleTabChange = (tabName = "all", allSongs) => {
    const tabs = document.getElementsByClassName("navigation-item");
    dispatch(clearAllSongList());
    if (tabName === "all") {
      tabs[0].classList.add("active");
      tabs[1].classList.remove("active");
      setShowTopTracks(false);
      dispatch(addSongList(allSongs));
    } else if (tabName === "top") {
      tabs[1].classList.add("active");
      tabs[0].classList.remove("active");
      setShowTopTracks(true);
      dispatch(addSongList(topTracks));
    }
  };

  //based on topTrack show or not setting up the list to show
  useEffect(() => {
    let val = allSongsList;
    if (showTopTracks) {
      val = topTracks;
    } else {
      val = allSongsList;
    }

    setSongList(val);
  }, [showTopTracks]);

  // function to handle search
  const handleSearch = useCallback(
    throttleSearch((value) => {
      //handling the input icon based on the value
      if (value !== "") {
        setInputIcon(
          <RxCross2
            onClick={() => {
              inputRef.current.value = null;
              console.log("input ref", inputRef.current.value);
              handleSearch("");
            }}
          />
        );
      } else {
        setInputIcon(FiSearch);
      }

      // performing search
      if (value) {
        let filteredList = allSongsList.filter(
          (song) =>
            song.name.toLowerCase().includes(value.toLowerCase()) ||
            song.artist.toLowerCase().includes(value.toLowerCase())
        );

        if (filteredList.length === 0) {
          setSongList([]);
          setErrMsg("No songs found ☹️");
        } else {
          setSongList(filteredList);
        }
      } else {
        setSongList(allSongsList);
      }
    }, 700),
    [allSongsList]
  );

  return (
    <div className="song-list__container">
      <div className="navigation-item__container">
        <span
          className="navigation-item"
          onClick={() => handleTabChange("all")}
        >
          For You
        </span>
        <span
          className="navigation-item"
          onClick={() => handleTabChange("top")}
        >
          Top Tracks
        </span>
      </div>

      <div className="search-bar">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search Song, Artist"
          className="search-bar__input"
          onChange={(e) => handleSearch(e.target.value)}
        />
        <button className="search-bar__button" aria-label="search">{inputIcon}</button>
      </div>

      <div className="song-list__items">
        {!songList.length ? (
          errorMsg ? (
            <p>{errorMsg}</p>
          ) : (
            <p>Loading...</p>
          )
        ) : (
          <>
            {songList.map((song) => (
              <div
                className={`song-list__item ${
                  currentPlayingSong?.id === song?.id ? "active" : ""
                }`}
                key={song.id}
                onClick={() => setCurrentSong(song)}
              >
                <img
                  src={
                    song.cover
                      ? `https://cms.samespace.com/assets/${song.cover}`
                      : "https://images.unsplash.com/photo-1608739871923-7da6d372f3c2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTgzfHxmYXNoaW9ufGVufDB8MHwwfHx8MA%3D%3D"
                  }
                  alt={song.name || "Album Cover"}
                  className="album-cover"
                />
                <div className="song-details">
                  <p className="song-name">{song.name}</p>
                  <p className="artist-name">{song.artist}</p>
                </div>
                <div className="song-duration">
                  <p className="song-name">{song.duration}</p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default SongList;
