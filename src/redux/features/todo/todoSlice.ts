import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday';
import { Todo, TodoList } from "@/db/db"
import { getTodosByDate, getTodosOverDue } from '@/db/todo-service'
import 'dayjs/locale/tr'
import { getTodoLists } from '@/db/todo-list-service';

// const userLang = typeof window !== "undefined" ? window.navigator.language : ''
dayjs.extend(weekday)
dayjs.locale('tr')

interface TodoState {
  activeDay: string,
  activeWeek: string,
  activeMonth: string,
  todos: Todo[],
  todosOverdue: Todo[],
  todoLists: TodoList[],
  selectedTodoDetail: Todo | null
}

export const fetchTodos = createAsyncThunk('fetch-todos', async (date: string) => {
  const todos = await getTodosByDate(date)
  return todos
})

export const fetchTodosOverdue = createAsyncThunk('fetch-todos-overdue', async () => {
  const todos = await getTodosOverDue()
  return todos
})

export const fetchActiveDayTodos = createAsyncThunk('fetch-active-day-todos', async (_, { getState }) => {
  const { todo } = getState() as any
  const todos = await getTodosByDate(todo.activeDay)
  return todos
})

export const fetchTodoLists = createAsyncThunk('fetch-todo-lists', async () => {
  const todoLists = await getTodoLists()
  return todoLists
})

export const todoSlice = createSlice({
  name: 'todo',
  initialState: {
    activeDay: dayjs().format('YYYY-MM-DD'),
    activeWeek: dayjs().weekday(0).format('YYYY-MM-DD'),
    activeMonth: dayjs().startOf('month').format('YYYY-MM-DD'),
    todos: [] as Todo[],
    selectedTodoDetail: null
  } as TodoState,
  reducers: {
    setTodos: (state, action) => {
      state.todos = action.payload
    },
    setTodoCompleted: (state, action) => {

    },
    setActiveDay: (state, action) => {
      state.activeDay = action.payload
    },
    setActiveWeek: (state, action) => {
      state.activeWeek = action.payload
    },
    setActiveMonth: (state, action) => {
      state.activeMonth = action.payload
    },
    setSelectedTodoDetail: (state, action) => {
      state.selectedTodoDetail = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTodos.fulfilled, (state, action) => {
      state.todos = action.payload
    })
    builder.addCase(fetchTodosOverdue.fulfilled, (state, action) => {
      state.todosOverdue = action.payload
    })
    builder.addCase(fetchActiveDayTodos.fulfilled, (state, action) => {
      state.todos = action.payload
    })
    builder.addCase(fetchTodoLists.fulfilled, (state, action) => {
      state.todoLists = action.payload
    })
  },
})

export const { setTodos, setActiveDay, setActiveWeek, setActiveMonth, setSelectedTodoDetail } = todoSlice.actions

export default todoSlice.reducer

