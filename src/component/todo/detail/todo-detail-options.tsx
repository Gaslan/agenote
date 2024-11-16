import { Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, styled } from "@mui/material";
import { grey } from "@mui/material/colors";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { db, Todo } from "@/db/db";
import { useAppDispatch } from "@/redux/app/hooks";
import { fetchActiveDayTodos, fetchTodosOverdue } from "@/redux/features/todo/todoSlice";

interface TodoDetailOptionsProps {
  todo: Todo
  onDelete: () => void
}

export default function TodoDetailOptions({ todo, onDelete }: TodoDetailOptionsProps) {

  const dispatch = useAppDispatch()

  async function handleDeleteButtonClick() {
    await db.todos.delete(todo.id)
    dispatch(fetchActiveDayTodos())
    dispatch(fetchTodosOverdue())
    onDelete()
  }

  return (
    <>
      <Box sx={{ display: 'flex', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', bgcolor: '#fff' }}>
        <Puller />
      </Box>
      <Box sx={{ paddingX: 0, paddingTop: '8px', paddingBottom: '4px', bgcolor: '#fff' }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton sx={{ paddingY: '16px' }}>
              <ListItemIcon sx={{ minWidth: '40px' }}>
                <EditOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Edit task" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton sx={{ paddingY: '16px' }}>
              <ListItemIcon sx={{ minWidth: '40px' }}>
                <TaskAltIcon />
              </ListItemIcon>
              <ListItemText primary="Complete task" />
            </ListItemButton>
          </ListItem>
            <Divider />
          <ListItem disablePadding>
            <ListItemButton onClick={handleDeleteButtonClick} sx={{ paddingY: '16px', color: '#d42424' }}>
              <ListItemIcon sx={{ color: 'currentcolor', minWidth: '40px' }}>
                <DeleteOutlineIcon />
              </ListItemIcon>
              <ListItemText primary="Delete task" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </>
  )
}

const Puller = styled('div')(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: grey[300],
  borderRadius: 3,
  margin: '8px auto',
  ...theme.applyStyles('dark', {
    backgroundColor: grey[900],
  }),
}));
