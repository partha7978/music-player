import { createSlice } from "@reduxjs/toolkit";


const songListSlice = createSlice({
    name: 'songList',
    initialState: {
        items: [],
    },
    reducers: {
        addSongList: (state, action) => {
            state.items.push(action.payload);
        },
        removeSongList: (state, action) => {
            state.items.splice(action.payload, 1);
        },
        clearAllSongList: (state) => {
            state.items = [];
        }
    }
})

export const { addSongList, removeSongList, clearAllSongList } = songListSlice.actions;

export default songListSlice.reducer;