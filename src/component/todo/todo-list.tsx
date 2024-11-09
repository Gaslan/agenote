'use client'
import { Todo } from "@/db/db"
import { getTodosByDate, getTodosOverDue } from "@/db/todo-service"
import { Box } from "@mui/material"
import dayjs, { Dayjs } from "dayjs"
import { useEffect, useState } from "react"
import CalendarSwiper from "./calendar-swiper"
import { Icon } from "@iconify/react/dist/iconify.js"

interface TodoListProps {

}

export default function TodoList({ }: TodoListProps) {

  const [todos, setTodos] = useState<Todo[]>([])
  const [todosOverDue, setTodosOverDue] = useState<Todo[]>([])
  const [activeDay, setActiveDay] = useState(dayjs())

  useEffect(() => {
    // fetchTodos(activeDay)
    fetchTodosOverdue()
  }, [])

  useEffect(() => {
    fetchTodos(activeDay)
  }, [activeDay])

  async function fetchTodos(date: Dayjs) {
    const todos = await getTodosByDate(date.format('YYYY-MM-DD'))
    setTodos(todos)
  }

  async function fetchTodosOverdue() {
    const todosOverDue = await getTodosOverDue()
    setTodosOverDue(todosOverDue)
  }
  return (
    <>
      <CalendarSwiper activeDay={activeDay} onActiveDayChange={setActiveDay} />
      <Box sx={{ marginBottom: '16px' }}>
        {todosOverDue.length > 0 && (
          <Box sx={{ paddingX: '16px', paddingY: '8px', borderBottom: '1px solid #c3c5c9' }}>Overdue</Box>
        )}
        {todosOverDue.map(todo => (
          <Box key={todo.id} sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #c3c5c9', bgcolor: '#fff', paddingY: '12px' }}>
            <Box sx={{ padding: '8px 16px' }}>
              <Box sx={{ '--size': '22px', height: 'var(--size)', width: 'var(--size)', border: '2px solid #737579', borderRadius: 'var(--size)' }} />
            </Box>
            <Box>{todo.title}</Box>
          </Box>
        ))}

      </Box>
      <Box sx={{}}>
        <Box sx={{ paddingX: '16px', paddingY: '8px', borderBottom: '1px solid #c3c5c9' }}>{activeDay.format('MMMM DD')}</Box>
        {todos && todos.map(todo => (
          <Box key={todo.id} sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #c3c5c9', bgcolor: '#fff', paddingY: '12px' }}>
            <Box sx={{ padding: '8px 16px' }}>
              <Box sx={{ '--size': '22px', height: 'var(--size)', width: 'var(--size)', border: '2px solid #737579', borderRadius: 'var(--size)' }} />
            </Box>
            <Box>{todo.title}</Box>
          </Box>
        ))}
        {todos.length == 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', color: '#e3e5e9' }}>
            <Icon icon={'mdi:inbox-remove-outline'} width={'4rem'} height={'4rem'} />
          </Box>
        )}
      </Box>
    </>
  )
}
