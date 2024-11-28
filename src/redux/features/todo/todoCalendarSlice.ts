import { createSlice } from '@reduxjs/toolkit'

interface TodoCalendarState {
  calendarMode: 'list' | 'day' | 'week' | 'month' | 'year',
}

export const todoCalendarSlice = createSlice({
  name: 'todo',
  initialState: {
    calendarMode: 'list'
  } as TodoCalendarState,
  reducers: {
    setCalendarMode: (state, action) => {
      state.calendarMode = action.payload
    }
  },
  extraReducers: (builder) => {
    
  },
})

export const { setCalendarMode,  } = todoCalendarSlice.actions

export default todoCalendarSlice.reducer

