import { createSlice } from '@reduxjs/toolkit'

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    selectedFolder: undefined,
    selectedNote: undefined,
    sidebarCollapsed: false
  },
  reducers: {
    selectFolder: (state, action) => {
      state.selectedFolder = action.payload
    },
    selectNote: (state, action) => {
      state.selectedNote = action.payload
    },
    toggleSidebarCollapse: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    }
  },
})

export const { selectFolder, selectNote, toggleSidebarCollapse } = appSlice.actions

export default appSlice.reducer
