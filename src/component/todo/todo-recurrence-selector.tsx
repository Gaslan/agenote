import { RecurringEventFrequency } from "@/db/db"
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, styled } from "@mui/material"
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { grey } from "@mui/material/colors"

interface TodoRecurrenceSelectorProps {
  value: RecurringEventFrequency | null
  onChange: (value: RecurringEventFrequency | null) => void
}

const recurrences = [
  {
    value: 'daily',
    label: 'Daily'
  },
  {
    value: 'weekly',
    label: 'Weekly'
  },
  {
    value: 'monthly',
    label: 'Monthly'
  },
  {
    value: 'yearly',
    label: 'Yearly'
  }
] as {
  value: RecurringEventFrequency | null,
  label: string
}[]

export default function TodoRecurrenceSelector({value, onChange}: TodoRecurrenceSelectorProps) {
  function handleItemClick(value: RecurringEventFrequency | null) {
    onChange(value)
  }
  return (
    <>
      <Box sx={{ display: 'flex', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', bgcolor: '#fff' }}>
        <Puller />
      </Box>
      <Box sx={{ paddingX: 0, paddingTop: '8px', paddingBottom: '8px', bgcolor: '#fff' }}>
        <List>
          <ListSubheader sx={{ borderBottom: '1px solid #f3f5f9', color: 'rgba(0,0,0,.65)' }}>Repeat</ListSubheader>
          {recurrences.map(recurrence => (
            <ListItem key={recurrence.value} disablePadding>
              <ListItemButton onClick={() => handleItemClick(recurrence.value)} sx={{ paddingY: '12px', borderBottom: '1px solid #f3f5f9' }}>
                
                <ListItemText primary={recurrence.label} sx={{ marginRight: 'auto' }} />
                {value == recurrence.value && <CheckRoundedIcon fontSize="small" sx={{color: (theme) => theme.palette.success.main}} />}
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
