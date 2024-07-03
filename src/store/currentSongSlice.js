import { createSlice } from "@reduxjs/toolkit";


const currentSongSlice = createSlice({
    name: 'currentSong',
    initialState: {
        items: {},
    },
    reducers: {
        addCurrentSong: (state, action) => {
            state.items = action.payload;
        },
        removeCurrentSong: (state, action) => {
            state.items = null;
        },
    }
})

export const { addCurrentSong, removeCurrentSong } = currentSongSlice.actions;

export default currentSongSlice.reducer;