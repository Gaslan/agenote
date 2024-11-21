import { alpha, Box, Collapse, IconButton, ListItem, ListItemButton, ListItemSecondaryAction, ListItemText, ListSubheader } from "@mui/material";
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import EventIcon from '@mui/icons-material/Event';
import { useAppSelector } from "@/redux/app/hooks";
import { Todo, TodoList } from "@/db/db";
import { useState } from "react";
import { PriorityData, PriorityValue } from "./todo-priority";
import dayjs, { Dayjs } from "dayjs";
import { Icon } from "@iconify/react/dist/iconify.js";

interface TodoListDayProps {
  todos: Todo[]
  todoLists: TodoList[]
  day: Dayjs
  onItemClick: (todo: Todo) => void
  onItemComplete: (todo: Todo) => void

}

export default function TodoListDay({ todos, todoLists, day, onItemClick, onItemComplete }: TodoListDayProps) {

  const [collapsed, setCollapsed] = useState(false)

  function handleTodoItemClick(todo: Todo) {
    onItemClick(todo)
  }

  function handleCompleteTodo(todo: Todo) {
    onItemComplete(todo)
  }

  function handleCollapseButtonClick() {
    setCollapsed(old => !old)
  }

  return (
    <>
      <ListSubheader onClick={handleCollapseButtonClick} sx={{ background: 'linear-gradient(#ffffff, #f0f2f7)', bgcolor: '#fff', borderBottom: '1px solid #d3d5d9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', userSelect: 'none' }}>
        <Box sx={{ fontWeight: 700 }}>{day.format('MMMM D')}</Box>
        {collapsed ? <KeyboardArrowUpRoundedIcon /> : <KeyboardArrowDownRoundedIcon />}
      </ListSubheader>
      {todos?.length > 0 && (

        <Collapse in={!collapsed}>
          <Box sx={{ paddingY: '2px' }}>
            {todos && todos.map(todo => {
              const Priority = PriorityData[todo.priority as PriorityValue]
              return (
                <ListItem key={todo.id}
                  disablePadding
                  onClick={() => handleTodoItemClick(todo)}
                  sx={{ borderBottom: '0px solid #d3d5d9', padding: '2px 4px' }}>
                  <ListItemButton sx={{ paddingLeft: '48px', paddingY: '12px', borderRadius: '4px', bgcolor: '#fff', boxShadow: '0 0 #0000, 0 0 #0000, 0 1px 3px rgba(0, 0, 0, .025), 0 1px 2px rgba(0, 0, 0, .05)' }}>
                    <Box sx={{ width: '100%' }}>
                      <ListItemText sx={{ ...(todo.completed && { color: '#939599', textDecoration: 'line-through', textDecorationColor: '#939599' }) }}>{todo.title}</ListItemText>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}></Box>
                        {!!todo.listId && <Box sx={{ fontSize: '12px' }}>{todoLists.find(list => list.id == todo.listId)?.name}</Box>}
                      </Box>
                    </Box>
                  </ListItemButton>
                  <ListItemSecondaryAction sx={{ right: 'auto', left: '18px', top: '8px', transform: "none", paddingTop: '2px' }}>
                    <IconButton
                      edge="start"
                      aria-label="complete"
                      onClick={() => handleCompleteTodo(todo)}
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
              )
            })}
          </Box>
        </Collapse>
      )}

      {todos.length == 0 && (
        <Collapse in={!collapsed}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', color: '#e3e5e9' }}>
            <Icon icon={'mdi:inbox-outline'} width={'4rem'} height={'4rem'} />
          </Box>
        </Collapse>
      )}
    </>
  )
}
