'use client'
import { Box, IconButton } from "@mui/material"
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import WestRoundedIcon from '@mui/icons-material/WestRounded';
import { Todo, TodoList } from "@/db/db";
import TodoListItem from "@/component/todo/todo-list-item";
import { getTodosByListId } from "@/db/todo-service";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/app/hooks";
import Bottombar from "@/component/todo/bottombar";
import { useRouter } from "next/navigation";

interface PageProps {
  params: { listId: number }
}

export default function Page({ params }: PageProps) {

  const [todos, setTodos] = useState<Todo[]>([])
  const todoLists = useAppSelector(state => state.todo.todoLists)
  const router = useRouter()

  useEffect(() => {
    async function fetch() {
      const todos = await getTodosByListId(params.listId)
      setTodos(todos)
    }
    fetch()
  }, [])

  function findListName(lists: TodoList[], listId: number) {
    return listId
      ? lists?.find(list => list.id == listId)?.name
      : undefined
  }

  const listName = findListName(todoLists, params.listId)

  return (
    <>
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: '60px', paddingBottom: '60px' }}>
        <Box sx={{ bgcolor: '#fff', zIndex: 999, userSelect: 'none', borderRadius: '0px', borderBottom: '1px solid #d3d5d9', height: '60px', position: 'fixed', top: 0, left: 0, right: 0 }}>
          <Box sx={{ height: '100%', paddingX: '16px', color: 'rgba(19,21,25,.75)', fontSize: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={() => { router.back() }} sx={{ fontSize: '1.5rem', marginLeft: '-8px', marginRight: '8px' }}>
                <WestRoundedIcon fontSize="inherit" />
              </IconButton>
              {listName}
            </Box>
            <Box>
              <IconButton onClick={() => { }} sx={{ fontSize: '1.5rem', marginRight: '-8px' }}>
                <MoreVertRoundedIcon fontSize="inherit" />
              </IconButton>
            </Box>
          </Box>
        </Box>
        <Box sx={{ paddingY: '2px', width: '100%' }}>
        {todos && todos.map(todo => (
          <TodoListItem key={todo.id} todo={todo} onComplete={() => {}} onItemClick={() => {}} />
        ))}
        </Box>



        <Bottombar />
      {/* <SidebarMenu sidebarRef={drawerLeftMenuRef} /> */}
      </Box>
    </>
  )
}
