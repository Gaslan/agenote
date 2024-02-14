import { createSlice } from '@reduxjs/toolkit'

export const settingsSlice = createSlice({
  name: 'app',
  initialState: {
    theme: 'light'
  },
  reducers: {
    changeTheme: (state, action) => {
      state.theme = action.payload
    },
  },
})

export const { changeTheme } = settingsSlice.actions

export default settingsSlice.reducer
