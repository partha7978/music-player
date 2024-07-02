import { useEffect, useState } from "react";
import "./style.scss";  
import SongList from "./components/song-list/SongList";
import SongDetails from "./components/song-details/SongDetails";
import Sidenav from "./components/sidenav/Sidenav";

function App() {

  const API_URL = "https://cms.samespace.com/items/songs";

  const [songs, setSongs] = useState([]);

  const fetchSongs = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    setSongs(data);

    console.log(data);
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  return (
    <>
      <div className="main-container">
        <Sidenav />
        <SongList />
        <SongDetails />
      </div>
    </>
  );
}

export default App;
