import { Box, List } from "@mui/material";
import CalendarSwiper from "../calendar-swiper";
import TodoListDay from "../../todo-list-day";
import { Todo, TodoList } from "@/db/db";
import { fetchActiveDayTodos, fetchTodosOverdue, setSelectedTodoDetail } from "@/redux/features/todo/todoSlice";
import { changeCompleted } from "@/db/todo-service";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import TodoDetail, { TodoDetailHandle } from "../../detail/todo-detail";
import { useEffect, useRef, useState } from "react";
import { getTodoLists } from "@/db/todo-list-service";
import dayjs from "dayjs";

interface CalendarModeListProps {
}

export default function CalendarModeList({ }: CalendarModeListProps) {

  const [todoLists, setTodoLists] = useState<TodoList[]>([])
  const todoDetailRef = useRef<TodoDetailHandle>(null)
  const todos = useAppSelector(state => state.todo.todos)
  const activeDayS = useAppSelector(state => state.todo.activeDay)
  const activeDay = dayjs(activeDayS, 'YYYY-MM-DD')
  const dispatch = useAppDispatch()

  useEffect(() => {
    fetchLists()
  }, [])

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
      <Box sx={{ paddingBottom: '8px', bgcolor: '#fff', userSelect: 'none', borderRadius: '0px', borderBottom: '1px solid #d3d5d9' }}>
        <CalendarSwiper />
      </Box>
      <List sx={{ position: 'relative', overflow: 'auto', paddingY: 0, flexGrow: 1, '& ul': { padding: 0, listStyle: 'none' }, '& .MuiCollapse-root': { flexGrow: 1 }, '& .MuiCollapse-wrapper': { height: '100%' } }} subheader={<li />}>
        <li style={{ height: '100%' }}>
          <ul style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <TodoListDay todos={todos} todoLists={todoLists} day={activeDay} loading={false} onItemClick={handleTodoItemClick} onItemComplete={handleCompleteTodo} />
          </ul>
        </li>
      </List>
      <TodoDetail ref={todoDetailRef} />
    </>
  )
}
