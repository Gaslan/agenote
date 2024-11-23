'use client'
import { Todo, TodoList } from "@/db/db"
import { changeCompleted } from "@/db/todo-service"
import { Box, List } from "@mui/material"
import dayjs from "dayjs"
import { useEffect, useRef, useState } from "react"
import CalendarSwiper from "./calendar/calendar-swiper"
import { fetchActiveDayTodos, fetchTodos, fetchTodosOverdue, setSelectedTodoDetail } from "@/redux/features/todo/todoSlice"
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks"
import TodoDetail, { TodoDetailHandle } from "./detail/todo-detail"
import TodoListOverdue from "./todo-list-overdue"
import { getTodoLists } from "@/db/todo-list-service"
import TodoListDay from "./todo-list-day"

interface TodoListProps {

}

export default function TodoLists({ }: TodoListProps) {

  const [todoLists, setTodoLists] = useState<TodoList[]>([])
  const [loading, setLoading] = useState(true)
  const todoDetailRef = useRef<TodoDetailHandle>(null)
  const dispatch = useAppDispatch()
  const todos = useAppSelector(state => state.todo.todos)
  const activeDayS = useAppSelector(state => state.todo.activeDay)
  const activeDay = dayjs(activeDayS, 'YYYY-MM-DD')

  useEffect(() => {
    // dispatch(fetchTodosOverdue())
    fetchLists()
  }, [])

  useEffect(() => {
    async function fetchActiveDayTodos() {
      setLoading(true)
      await dispatch(fetchTodos(activeDayS))
      setLoading(false)
    }
    fetchActiveDayTodos()
  }, [activeDayS])

  async function fetchLists() {
    const lists = await getTodoLists()
    setTodoLists(lists)
  }

  function handleTodoItemClick(todo: Todo) {
    setTimeout(() => {
      dispatch(setSelectedTodoDetail(todo))
      todoDetailRef.current?.open()
    }, 200)
  }

  async function handleCompleteTodo(todo: Todo) {
    await changeCompleted(todo.id, !todo.completed)
    await dispatch(fetchActiveDayTodos())
    await dispatch(fetchTodosOverdue())
    navigator.vibrate(50)
  }

  return (
    <>
      <Box sx={{ paddingBottom: '60px', paddingX: '0px', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CalendarSwiper />
        <List sx={{ position: 'relative', overflow: 'auto', paddingY: 0, flexGrow: 1, '& ul': { padding: 0, listStyle: 'none' }, '& .MuiCollapse-root': {flexGrow: 1}, '& .MuiCollapse-wrapper': {height: '100%'} }} subheader={<li />}>
          {/* <li>
            <ul>
              <TodoListOverdue todoLists={todoLists} onItemClick={handleTodoItemClick} onItemComplete={handleCompleteTodo} />
            </ul>
          </li> */}
          <li style={{height: '100%'}}>
            <ul style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
              <TodoListDay todos={todos} todoLists={todoLists} day={activeDay} loading={loading} onItemClick={handleTodoItemClick} onItemComplete={handleCompleteTodo} />
            </ul>
          </li>
        </List>
        <TodoDetail ref={todoDetailRef} />
      </Box>
    </>
  )
}
