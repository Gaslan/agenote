'use client'
import { Todo } from "@/db/db"
import { getTodosOverDue } from "@/db/todo-service"
import { Box } from "@mui/material"
import dayjs from "dayjs"
import { useEffect, useRef, useState } from "react"
import CalendarSwiper from "./calendar/calendar-swiper"
import { Icon } from "@iconify/react/dist/iconify.js"
import { fetchTodos } from "@/redux/features/todo/todoSlice"
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks"
import TodoDetail, { TodoDetailHandle } from "./todo-detail"
// import 'dayjs/locale/tr'
// dayjs.locale('tr', {weekStart: 1})


interface TodoListProps {

}

export default function TodoList({ }: TodoListProps) {

  const [todosOverDue, setTodosOverDue] = useState<Todo[]>([])
  const todoDetailRef = useRef<TodoDetailHandle>(null)
  const dispatch = useAppDispatch()
  const todos = useAppSelector(state => state.todo.todos)
  const activeDayS = useAppSelector(state => state.todo.activeDay) 
  const activeDay = dayjs(activeDayS, 'YYYY-MM-DD')

  useEffect(() => {
    fetchTodosOverdue()
  }, [])

  useEffect(() => {
    dispatch(fetchTodos(activeDayS))
  }, [activeDayS])

  async function fetchTodosOverdue() {
    const todosOverDue = await getTodosOverDue()
    setTodosOverDue(todosOverDue)
  }
  
  return (
    <>
      <CalendarSwiper />
      <Box sx={{ marginBottom: '16px' }}>
        {todosOverDue.length > 0 && (
          <Box sx={{ paddingX: '16px', paddingY: '8px', borderBottom: '1px solid #c3c5c9' }}>Overdue</Box>
        )}
        {todosOverDue.map(todo => (
          <Box
            key={todo.id} 
            onClick={() => todoDetailRef.current?.open()}
            sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #c3c5c9', bgcolor: '#fff', paddingY: '12px' }}>
            <Box sx={{ padding: '8px 16px' }}>
              <Box sx={{ '--size': '22px', height: 'var(--size)', width: 'var(--size)', border: '2px solid #737579', borderRadius: 'var(--size)' }} />
            </Box>
            <Box>{todo.title}</Box>
          </Box>
        ))}

      </Box>
      <Box sx={{}}>
        <Box sx={{ paddingX: '16px', paddingY: '8px', borderBottom: '1px solid #c3c5c9' }}>{activeDay.format('MMMM D')}</Box>
        {todos && todos.map(todo => (
          <Box 
            key={todo.id} 
            onClick={() => todoDetailRef.current?.open()}
            sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #c3c5c9', bgcolor: '#fff', paddingY: '12px' }}>
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

      <TodoDetail ref={todoDetailRef} />
    </>
  )
}
