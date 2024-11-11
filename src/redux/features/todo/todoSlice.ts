import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday';
import { Todo } from "@/db/db"
import { getTodosByDate } from '@/db/todo-service'
import 'dayjs/locale/tr'

// const userLang = typeof window !== "undefined" ? window.navigator.language : ''
dayjs.extend(weekday)
dayjs.locale('tr')

interface TodoState {
  activeWeek: string,
  activeDay: string,
  todos: Todo[],
  selectedTodoDetail: Todo | null
}

export const fetchTodos = createAsyncThunk('fetch-todos', async (date: string) => {
  const todos = await getTodosByDate(date)
  return todos
})

export const fetchActiveDayTodos = createAsyncThunk('fetch-active-day-todos', async (_, { getState }) => {
  const { todo } = getState() as any
  const todos = await getTodosByDate(todo.activeDay)
  return todos
})

export const todoSlice = createSlice({
  name: 'todo',
  initialState: {
    activeWeek: dayjs().weekday(0).format('YYYY-MM-DD'),
    activeDay: dayjs().format('YYYY-MM-DD'),
    todos: [] as Todo[],
    selectedTodoDetail: null
  } as TodoState,
  reducers: {
    setTodos: (state, action) => {
      state.todos = action.payload
    },
    setActiveDay: (state, action) => {
      state.activeDay = action.payload
    },
    setActiveWeek: (state, action) => {
      state.activeWeek = action.payload
    },
    setSelectedTodoDetail: (state, action) => {
      state.selectedTodoDetail = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTodos.fulfilled, (state, action) => {
      state.todos = action.payload
    }),
      builder.addCase(fetchActiveDayTodos.fulfilled, (state, action) => {
        state.todos = action.payload
      })
  },
})

export const { setTodos, setActiveDay, setActiveWeek, setSelectedTodoDetail } = todoSlice.actions

export default todoSlice.reducer

