'use client'
import { Box, Button, Collapse, IconButton, List } from "@mui/material"
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import WestRoundedIcon from '@mui/icons-material/WestRounded';
import { Todo, TodoList } from "@/db/db";
import TodoListItem from "@/component/todo/todo-list-item";
import { changeCompleted, getTodosByListId } from "@/db/todo-service";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/app/hooks";
import Bottombar from "@/component/todo/bottombar";
import { useRouter } from "next/navigation";
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';

interface PageProps {
  params: { listId: number }
}

export default function Page({ params }: PageProps) {

  const [todos, setTodos] = useState<Todo[]>([])
  const [completedCollapsed, setCompletedCollapsed] = useState(false)
  const todoLists = useAppSelector(state => state.todo.todoLists)
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const todos = await getTodosByListId(+params.listId)
    setTodos(todos)
  }

  async function handleItemComplete(todo: Todo) {
    await changeCompleted(todo.id, !todo.completed)
    if (!todo.completed) {
      new Audio('/completed.mp3').play()
    }
    navigator.vibrate(50)
    fetchData()
  }

  function findListName(lists: TodoList[], listId: number) {
    return listId
      ? lists?.find(list => list.id == listId)?.name
      : undefined
  }

  const listName = findListName(todoLists, params.listId)

  const completedTodos = todos.filter(todo => todo.completed)
  const unCompletedTodos = todos.filter(todo => !todo.completed)

  return (
    <>
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: '60px', paddingBottom: '60px' }}>
        <Box sx={{ bgcolor: '#ffffff00', zIndex: 999, userSelect: 'none', borderRadius: '0px', borderBottom: '0px solid #d3d5d9', height: '60px', position: 'fixed', top: 0, left: 0, right: 0 }}>
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
        <Box sx={{ paddingY: '2px', width: '100%', flexGrow: 1 }}>
          {todos.length == 0 && (
            <Box sx={{ height: '100%', paddingTop: '30%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="5rem" height="5rem" viewBox="0 0 24 24">
                <path fill="#0674ea" d="M2 12.204c0-2.289 0-3.433.52-4.381c.518-.949 1.467-1.537 3.364-2.715l2-1.241C9.889 2.622 10.892 2 12 2s2.11.622 4.116 1.867l2 1.241c1.897 1.178 2.846 1.766 3.365 2.715S22 9.915 22 12.203v1.522c0 3.9 0 5.851-1.172 7.063S17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.212S2 17.626 2 13.725z" opacity="0.5" />
                <path fill="#0674ea" d="M12.75 11a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V17a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25z" />
              </svg>
              <Box sx={{color: '#0674ea', marginTop: '12px'}}>
                <Button variant="text" sx={{textTransform: 'none', fontSize: '15px', fontWeight: 400}}>Add new task</Button>
              </Box>
            </Box>
          )}
          <List sx={{ position: 'relative', overflow: 'auto', paddingY: 0, flexGrow: 1, '& ul': { padding: 0, listStyle: 'none' }, '& .MuiCollapse-root': { flexGrow: 1 }, '& .MuiCollapse-wrapper': { height: '100%' } }} subheader={<li />}>
            {unCompletedTodos.map(todo => (
              <TodoListItem
                key={todo.id}
                todo={todo}
                isListNameVisible={false}
                onComplete={handleItemComplete}
                onItemClick={() => { }} />
            ))}
            {completedTodos.length > 0 && (
              <>
                <li style={{ padding: '0 4px' }}>
                  <Button fullWidth variant="text" onClick={() => setCompletedCollapsed(old => !old)} sx={{ paddingX: '6px', paddingY: '12px', justifyContent: 'flex-start', textTransform: 'none', color: 'currentcolor' }}>
                    <ExpandMoreRoundedIcon sx={{ marginRight: '6px', transition: 'transform ease .2s', ...(completedCollapsed && { transform: 'rotate(-90deg)' }) }} />
                    Completed
                  </Button>
                </li>
                <Collapse in={!completedCollapsed}>
                  {completedTodos.map(todo => (
                    <TodoListItem
                      key={todo.id}
                      todo={todo}
                      isListNameVisible={false}
                      onComplete={handleItemComplete}
                      onItemClick={() => { }} />
                  ))}
                </Collapse>
              </>
            )}
          </List>
        </Box>

        {/* <Bottombar /> */}
        {/* <SidebarMenu sidebarRef={drawerLeftMenuRef} /> */}
      </Box>
    </>
  )
}
