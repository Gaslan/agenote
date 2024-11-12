'use client'
import { Todo } from "@/db/db"
import { changeCompleted } from "@/db/todo-service"
import { Box, Collapse, IconButton, List, ListItem, ListItemButton, ListItemSecondaryAction, ListItemText, ListSubheader } from "@mui/material"
import dayjs from "dayjs"
import { useEffect, useRef } from "react"
import CalendarSwiper from "./calendar/calendar-swiper"
import { Icon } from "@iconify/react/dist/iconify.js"
import { fetchActiveDayTodos, fetchTodos, fetchTodosOverdue, setSelectedTodoDetail } from "@/redux/features/todo/todoSlice"
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks"
import TodoDetail, { TodoDetailHandle } from "./detail/todo-detail"
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';

interface TodoListProps {

}

export default function TodoList({ }: TodoListProps) {

  const todoDetailRef = useRef<TodoDetailHandle>(null)
  const dispatch = useAppDispatch()
  const todos = useAppSelector(state => state.todo.todos)
  const todosOverdue = useAppSelector(state => state.todo.todosOverdue)
  const activeDayS = useAppSelector(state => state.todo.activeDay)
  const activeDay = dayjs(activeDayS, 'YYYY-MM-DD')

  useEffect(() => {
    dispatch(fetchTodosOverdue())
  }, [])

  useEffect(() => {
    dispatch(fetchTodos(activeDayS))
  }, [activeDayS])

  function handleTodoItemClick(todo: Todo) {
    setTimeout(() => {
      dispatch(setSelectedTodoDetail(todo))
      todoDetailRef.current?.open()
    }, 200)
  }

  function handleCompleteTodo(todo: Todo) {
    return async function () {
      await changeCompleted(todo.id, !todo.completed)
      await dispatch(fetchActiveDayTodos())
      await dispatch(fetchTodosOverdue())
    }
  }

  return (
    <>
      <Box sx={{ paddingTop: '50px', paddingX: '0px', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CalendarSwiper />

        <List sx={{ position: 'relative', overflow: 'auto', paddingY: 0, '& ul': { padding: 0, listStyle: 'none' } }} subheader={<li />}>
          <li>
            <ul>
              {todosOverdue?.length > 0 && (
                <ListSubheader sx={{ bgcolor: '#f0f2f7', borderBottom: '1px solid #d3d5d9' }}>Gecikmiş</ListSubheader>
              )}
              {todosOverdue && todosOverdue.map(todo => (
                <Collapse in={true} key={todo.id}>
                  <ListItem
                    disablePadding
                    onClick={() => handleTodoItemClick(todo)}
                    sx={{ bgcolor: '#fff', borderBottom: '1px solid #d3d5d9', paddingX: 0 }}>
                    <ListItemButton sx={{ paddingLeft: '48px', paddingY: '12px' }}>
                      <ListItemText sx={{ ...(todo.completed && { color: '#939599', textDecoration: 'line-through', textDecorationColor: '#939599' }) }}>{todo.title}</ListItemText>
                    </ListItemButton>
                    <ListItemSecondaryAction sx={{ right: 'auto', left: '16px' }}>
                      <IconButton
                        edge="start"
                        aria-label="complete"
                        onClick={handleCompleteTodo(todo)}
                      >
                        {todo.completed && (
                          <Box component={'svg'} xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 24 24" sx={{ color: (theme) => theme.palette.primary.main }}>
                            <path fill="currentColor" d="m10.6 13.8l-2.15-2.15q-.275-.275-.7-.275t-.7.275t-.275.7t.275.7L9.9 15.9q.3.3.7.3t.7-.3l5.65-5.65q.275-.275.275-.7t-.275-.7t-.7-.275t-.7.275zM12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22" />
                          </Box>
                        )}
                        {!todo.completed && <RadioButtonUncheckedRoundedIcon />}
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </Collapse>
              ))}
            </ul>
          </li>
          <li>
            <ul>
              {todos && (
                <ListSubheader sx={{ bgcolor: '#f0f2f7', borderBottom: '1px solid #d3d5d9' }}>{activeDay.format('MMMM D')}</ListSubheader>
              )}
              {todos && todos.map(todo => (
                <Collapse in={true} key={todo.id}>
                  <ListItem
                    disablePadding
                    onClick={() => handleTodoItemClick(todo)}
                    sx={{ bgcolor: '#fff', borderBottom: '1px solid #d3d5d9', paddingX: 0 }}>
                    <ListItemButton sx={{ paddingLeft: '48px', paddingY: '12px' }}>
                      <ListItemText sx={{ ...(todo.completed && { color: '#939599', textDecoration: 'line-through', textDecorationColor: '#939599' }) }}>{todo.title}</ListItemText>
                    </ListItemButton>
                    <ListItemSecondaryAction sx={{ right: 'auto', left: '16px' }}>
                      <IconButton
                        edge="start"
                        aria-label="complete"
                        onClick={handleCompleteTodo(todo)}
                      >
                        {todo.completed && (
                          <Box component={'svg'} xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 24 24" sx={{ color: (theme) => theme.palette.primary.main }}>
                            <path fill="currentColor" d="m10.6 13.8l-2.15-2.15q-.275-.275-.7-.275t-.7.275t-.275.7t.275.7L9.9 15.9q.3.3.7.3t.7-.3l5.65-5.65q.275-.275.275-.7t-.275-.7t-.7-.275t-.7.275zM12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22" />
                          </Box>
                        )}
                        {!todo.completed && <RadioButtonUncheckedRoundedIcon />}
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </Collapse>
              ))}
              {todos.length == 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', color: '#e3e5e9' }}>
                  <Icon icon={'mdi:inbox-outline'} width={'4rem'} height={'4rem'} />
                </Box>
              )}
            </ul>
          </li>
        </List>

        <TodoDetail ref={todoDetailRef} />
      </Box>
    </>
  )
}
