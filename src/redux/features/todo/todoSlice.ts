import { createSlice } from '@reduxjs/toolkit'
import dayjs, { Dayjs } from 'dayjs'
import { Todo } from "@/db/db"

export const todoSlice = createSlice({
  name: 'todo',
  initialState: {
    activeWeek: dayjs().weekday(0),
    activeDay: dayjs(),
    todos: []
  },
  reducers: {
    // selectFolder: (state, action) => {
    //   state.selectedFolder = action.payload
    // },
    // selectNote: (state, action) => {
    //   state.selectedNote = action.payload
    // },
    // toggleSidebarCollapse: (state) => {
    //   state.sidebarCollapsed = !state.sidebarCollapsed
    // },
    setTodos: (state, action) => {
      state.todos = action.payload
      // return state
    }
  },
})

export const { setTodos } = todoSlice.actions

export default todoSlice.reducer
