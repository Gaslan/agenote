'use client'
import { Box, IconButton, List } from "@mui/material";
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import Bottombar from "@/component/todo/bottombar";
import TodoListOverdue from "@/component/todo/todo-list-overdue";
import { getTodoLists } from "@/db/todo-list-service";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import { changeCompleted } from "@/db/todo-service";
import { Todo, TodoList } from "@/db/db";
import { fetchActiveDayTodos, fetchTodos, fetchTodosOverdue, setSelectedTodoDetail } from "@/redux/features/todo/todoSlice";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { TodoDetailHandle } from "@/component/todo/detail/todo-detail";
import { SwipeableDrawerBaseHandle } from "@/component/mobile/swipeable-drawer-base";
import SidebarMenu from "@/component/todo/sidebar-menu";

interface PageProps {

}

export default function Page({ }: PageProps) {

  const [todoLists, setTodoLists] = useState<TodoList[]>([])
  const todoDetailRef = useRef<TodoDetailHandle>(null)
  const dispatch = useAppDispatch()
  const todos = useAppSelector(state => state.todo.todos)
  const activeDayS = useAppSelector(state => state.todo.activeDay)
  const activeDay = dayjs(activeDayS, 'YYYY-MM-DD')
  const drawerLeftMenuRef = useRef<SwipeableDrawerBaseHandle>(null)

  useEffect(() => {
    dispatch(fetchTodosOverdue())
    fetchLists()
  }, [])

  useEffect(() => {
    dispatch(fetchTodos(activeDayS))
  }, [activeDayS])


  function handleLeftMenuButtonClick() {
    setTimeout(() => {
      drawerLeftMenuRef.current?.open()
    }, 200)
  }

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
    <Box sx={{height: '100%', display: 'flex', flexDirection: 'column', paddingTop: '50px'}}>
      <Box sx={{ bgcolor: '#fff', zIndex: 999, userSelect: 'none', borderRadius: '0px', borderBottom: '1px solid #d3d5d9', height: '50px', position: 'fixed', top: 0, left: 0, right: 0 }}>
        <Box sx={{ height: '100%', paddingX: '16px', color: 'rgba(19,21,25,.75)', fontSize: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handleLeftMenuButtonClick} sx={{ fontSize: '1.5rem', marginLeft: '-8px', marginRight: '8px' }}>
              <MenuRoundedIcon fontSize="inherit" />
            </IconButton>
            Today
          </Box>
          <Box>
            <IconButton onClick={() => { }} sx={{ fontSize: '1.5rem', marginRight: '-8px' }}>
              <MoreVertRoundedIcon fontSize="inherit" />
            </IconButton>
          </Box>
        </Box>
      </Box>


      <List sx={{ position: 'relative', overflow: 'auto', paddingY: 0, '& ul': { padding: 0, listStyle: 'none' } }} subheader={<li />}>
        <TodoListOverdue todoLists={todoLists} onItemClick={handleTodoItemClick} onItemComplete={handleCompleteTodo} />
      </List>

      <Bottombar />
      <SidebarMenu sidebarRef={drawerLeftMenuRef} />
    </Box>
  )
}
