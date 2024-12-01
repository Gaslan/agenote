import { createSlice } from '@reduxjs/toolkit'

interface TodoCalendarState {
  calendarMode: 'list' | 'day' | 'week' | 'month' | 'year',
  calendarViewMode: 'week' | 'month' | 'month-full'
}

export const todoCalendarSlice = createSlice({
  name: 'todo',
  initialState: {
    calendarMode: 'list',
    calendarViewMode: 'week',

  } as TodoCalendarState,
  reducers: {
    setCalendarMode: (state, action) => {
      state.calendarMode = action.payload
    },
    setCalendarViewMode: (state, action) => {
      state.calendarViewMode = action.payload
    }
  },
  extraReducers: (builder) => {
    
  },
})

export const { setCalendarMode, setCalendarViewMode } = todoCalendarSlice.actions

export default todoCalendarSlice.reducer

