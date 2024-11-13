import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, styled } from "@mui/material";
import { grey } from "@mui/material/colors";
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { PriorityData } from "./todo-priority";

interface TodoPrioritySelectorProps {
  value: number
  onChange: (value: number) => void
}

export default function TodoPrioritySelector({ value, onChange }: TodoPrioritySelectorProps) {

  function handleItemClick(value: number) {
    onChange(value)
  }

  return (
    <>
      <Box sx={{ display: 'flex', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', bgcolor: '#fff' }}>
        <Puller />
      </Box>
      <Box sx={{ paddingX: 0, paddingTop: '8px', paddingBottom: '8px', bgcolor: '#fff' }}>
        <List>
          <ListSubheader sx={{ borderBottom: '1px solid #f3f5f9', color: 'rgba(0,0,0,.65)' }}>Priority</ListSubheader>
          {Object.values(PriorityData).sort((a, b) => b.value - a.value).map(priority => (
            <ListItem key={priority.value} disablePadding>
              <ListItemButton onClick={() => handleItemClick(priority.value)} sx={{ paddingY: '12px', borderBottom: '1px solid #f3f5f9' }}>
                <ListItemIcon sx={{ minWidth: '40px', color: priority.color }}>
                  {<priority.icon/>}
                </ListItemIcon>
                <ListItemText primary={priority.label} sx={{ marginRight: 'auto' }} />
                {value == priority.value && <CheckRoundedIcon fontSize="small" sx={{color: (theme) => theme.palette.success.main}} />}
              </ListItemButton>
            </ListItem>
          ))}
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
}))
