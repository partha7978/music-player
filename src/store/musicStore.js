import { configureStore } from "@reduxjs/toolkit";
import currentSongSlice from "./currentSongSlice";
import songListSlice from "./songListSlice";

const musicStore = configureStore({
    reducer: {
        currentSong: currentSongSlice, 
        songList: songListSlice,
    }
});

export default musicStore;