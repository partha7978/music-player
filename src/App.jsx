import { useEffect, useState } from "react";
import "./style.scss";
import SongList from "./components/song-list/SongList";
import SongDetails from "./components/song-details/SongDetails";
import Sidenav from "./components/sidenav/Sidenav";
import { Provider, useDispatch } from 'react-redux'
import musicStore from "./store/musicStore";
import { addSongList } from "./store/songListSlice";

function App() {

  return (
    <>
      <Provider store={musicStore}>
        <div className="main-container">
          <Sidenav />
          <SongList />
          <SongDetails />
        </div>
      </Provider>
    </>
  );
}

export default App;
