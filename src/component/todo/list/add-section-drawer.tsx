import { Box, IconButton, InputBase } from "@mui/material";
import { ChangeEvent, useLayoutEffect, useRef, useState } from "react";
import SendIcon from '@mui/icons-material/Send';

interface AddSectionDrawerProps {
  onNameSubmit: (name: string) => void
}

export default function AddSectionDrawer({onNameSubmit }: AddSectionDrawerProps) {

  const [name, setName] = useState('')
  const taskInputRef = useRef<HTMLInputElement>(null)

  useLayoutEffect(() => {
    taskInputRef.current?.focus()
  }, [taskInputRef])

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    setName(event.currentTarget.value)
  }

  function submitName() {
    onNameSubmit(name)
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', bgcolor: theme => theme.palette.background.paper }}>
      <Box sx={{ paddingX: '16px', paddingTop: '12px', paddingBottom: '8px', flexGrow: 1 }}>
        <InputBase
          inputRef={taskInputRef}
          fullWidth
          autoComplete="false"
          placeholder="Add Section"
          value={name}
          onChange={handleNameChange}
          sx={{ '&>.MuiInputBase-input': { fontSize: '20px' } }} />
      </Box>
      <Box sx={{paddingX: '8px'}}>
      <IconButton onClick={submitName}>
        <SendIcon />
      </IconButton>
      </Box>
    </Box>
  )
}
